"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDomainInfo = getDomainInfo;
exports.registerDomain = registerDomain;
exports.getDomainRegistry = getDomainRegistry;
const registry = new Map();
function getDomainInfo(domain) {
    return registry.get(domain);
}
function registerDomain(domain, price, owner) {
    registry.set(domain, { domain, price, owner });
}
function getDomainRegistry() {
    return registry;
}
