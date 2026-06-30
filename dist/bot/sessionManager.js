"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setSession = setSession;
exports.getSession = getSession;
exports.clearSession = clearSession;
// In-memory store
const sessions = new Map();
function setSession(userId, session) {
    sessions.set(userId, session);
}
function getSession(userId) {
    return sessions.get(userId);
}
function clearSession(userId) {
    sessions.delete(userId);
}
//# sourceMappingURL=sessionManager.js.map