import { DomainRegistry } from '../types';

const registry = new Map<string, DomainRegistry>();

export function getDomainInfo(domain: string): DomainRegistry | undefined {
  return registry.get(domain);
}

export function registerDomain(domain: string, price: string, owner: string): void {
  registry.set(domain, { domain, price, owner });
}

export function getDomainRegistry(): Map<string, DomainRegistry> {
  return registry;
}