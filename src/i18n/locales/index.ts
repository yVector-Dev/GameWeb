import enContent from './en/content';
import enEvents from './en/events';
import enUi from './en/ui';
import esContent from './es/content';
import esEvents from './es/events';
import esUi from './es/ui';
import ptContent from './pt-BR/content';
import ptEvents from './pt-BR/events';
import ptUi from './pt-BR/ui';

export interface MessageTree {
  readonly [key: string]: string | MessageTree;
}

export type Messages = Record<string, string>;

/** Flattens nested message objects into dotted keys, rejecting collisions. */
export function flatten(trees: MessageTree[]): Messages {
  const out: Messages = {};
  const walk = (node: MessageTree, prefix: string) => {
    for (const [key, value] of Object.entries(node)) {
      const path = prefix ? `${prefix}.${key}` : key;
      if (typeof value === 'string') {
        if (out[path] !== undefined) throw new Error(`Duplicate translation key: ${path}`);
        out[path] = value;
      } else {
        walk(value, path);
      }
    }
  };
  for (const tree of trees) walk(tree, '');
  return out;
}

export const DICTIONARIES: Record<'en' | 'pt-BR' | 'es', Messages> = {
  en: flatten([enUi, enContent, enEvents]),
  'pt-BR': flatten([ptUi, ptContent, ptEvents]),
  es: flatten([esUi, esContent, esEvents]),
};
