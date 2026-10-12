import { ref, type Ref } from "vue";

const states = new Map<string, Ref>();

export function useState<T>(key: string, init?: () => T): Ref<T> {
  if (!states.has(key)) {
    states.set(key, ref(init?.()) as Ref<T>);
  }

  return states.get(key) as Ref<T>;
}
