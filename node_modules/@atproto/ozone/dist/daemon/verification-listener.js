"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerificationListener = void 0;
const api_1 = require("@atproto/api");
const background_1 = require("../background");
const service_1 = require("../jetstream/service");
const logger_1 = require("../logger");
const service_2 = require("../verification/service");
class VerificationListener {
    constructor(db, jetstreamUrl, verifierIssuersToIndex) {
        Object.defineProperty(this, "db", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: db
        });
        Object.defineProperty(this, "jetstreamUrl", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: jetstreamUrl
        });
        Object.defineProperty(this, "verifierIssuersToIndex", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: verifierIssuersToIndex
        });
        Object.defineProperty(this, "destroyed", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "cursor", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "jetstream", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "collection", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'app.bsky.graph.verification'
        });
        Object.defineProperty(this, "backgroundQueue", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new background_1.BackgroundQueue(this.db, { concurrency: 1 })
        });
        Object.defineProperty(this, "verificationService", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: service_2.VerificationService.creator()(this.db)
        });
    }
    // When the queue has capacity, this method returns true which means we can continue to handle events
    // otherwise, it will close jetstream connection and wait for all previously queued events to be processed first
    // and then start jetstream listener again before returning false. At that point, the previous listeners should
    // have updates the cursor in db to the last processed event and the new listener will start from that cursor
    async ensureCoolDown() {
        const { waitingCount, runningCount } = this.backgroundQueue.getStats();
        if (waitingCount > 50 || runningCount > 50) {
            logger_1.verificationLogger.warn(`Background queue is full, pausing listener`);
            this.jetstream?.close();
            await this.backgroundQueue.processAll();
            await this.start();
            return false;
        }
        return true;
    }
    handleNewVerification(issuer, uri, cid, record, cursor) {
        this.backgroundQueue.add(async () => {
            try {
                const { subject, handle, displayName, createdAt } = record;
                await this.verificationService.create([
                    { uri, cid, issuer, subject, handle, displayName, createdAt },
                ]);
                await this.updateCursor(cursor);
            }
            catch (err) {
                logger_1.verificationLogger.error(err, 'Error handling verification create event');
            }
        });
    }
    handleDeletedVerification(uri, cursor) {
        this.backgroundQueue.add(async () => {
            try {
                await this.verificationService.markRevoked({
                    uris: [uri],
                });
                await this.updateCursor(cursor);
            }
            catch (err) {
                logger_1.verificationLogger.error(err, 'Error handling verification delete event');
            }
        });
    }
    async getCursor() {
        await this.verificationService.createFirehoseCursor();
        const cursor = await this.verificationService.getFirehoseCursor();
        if (cursor) {
            this.cursor = cursor;
        }
        return this.cursor;
    }
    async updateCursor(cursor) {
        // Assuming cursors are always incremental, if we have processed an event with higher value cursor, let's not update to a lower value
        if (this.cursor && this.cursor >= cursor) {
            return;
        }
        // This will only update if the cursor is higher than the current one in db
        const updatedCursor = await this.verificationService.updateFirehoseCursor(cursor);
        if (updatedCursor) {
            this.cursor = updatedCursor;
        }
    }
    async start() {
        await this.getCursor();
        this.jetstream = new service_1.Jetstream({
            endpoint: this.jetstreamUrl,
            cursor: this.cursor || undefined,
            wantedCollections: [this.collection],
            wantedDids: this.verifierIssuersToIndex?.length
                ? this.verifierIssuersToIndex
                : undefined,
        });
        await this.jetstream.start({
            onCreate: {
                [this.collection]: async (e) => {
                    const recordValidity = api_1.lexicons.validate(this.collection, e.commit.record);
                    if (!recordValidity.success) {
                        logger_1.verificationLogger.error(recordValidity.error, 'Invalid verification record in the firehose');
                        return;
                    }
                    const hasCapacity = await this.ensureCoolDown();
                    if (hasCapacity) {
                        const issuer = e.did;
                        const { record, rkey, collection, cid } = e.commit;
                        const uri = `at://${issuer}/${collection}/${rkey}`;
                        this.handleNewVerification(issuer, uri, cid, record, e.time_us);
                    }
                },
            },
            onDelete: {
                [this.collection]: async (e) => {
                    const hasCapacity = await this.ensureCoolDown();
                    if (hasCapacity) {
                        this.handleDeletedVerification(`at://${e.did}/${e.commit.collection}/${e.commit.rkey}`, e.time_us);
                    }
                },
            },
        });
    }
    stop() {
        this.jetstream?.close();
        this.backgroundQueue.destroy();
        this.destroyed = true;
    }
}
exports.VerificationListener = VerificationListener;
//# sourceMappingURL=verification-listener.js.map