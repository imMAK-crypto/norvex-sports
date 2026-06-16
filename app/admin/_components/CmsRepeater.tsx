'use client';

import { useState } from 'react';

type FieldDef = { key: string; placeholder: string; width?: number };

export function CmsRepeater({
  name,
  fields,
  defaultItems,
  addLabel = '+ Add row',
  max = 12,
}: {
  name: string;
  fields: FieldDef[];
  defaultItems: Record<string, string>[];
  addLabel?: string;
  max?: number;
}) {
  const [items, setItems] = useState<Record<string, string>[]>(
    defaultItems.length ? defaultItems : [Object.fromEntries(fields.map((f) => [f.key, '']))],
  );

  function update(i: number, key: string, val: string) {
    setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, [key]: val } : it)));
  }
  function remove(i: number) {
    setItems((prev) => prev.filter((_, idx) => idx !== i));
  }
  function add() {
    if (items.length >= max) return;
    setItems((prev) => [...prev, Object.fromEntries(fields.map((f) => [f.key, '']))]);
  }
  function move(i: number, dir: -1 | 1) {
    setItems((prev) => {
      const next = [...prev];
      const j = i + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <input type="hidden" name={name} value={JSON.stringify(items)} />
      {items.map((it, i) => (
        <div key={i} className="cms-rise" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button type="button" onClick={() => move(i, -1)} title="Move up" style={{ color: 'var(--t5)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, padding: 0 }}>⠿</button>
          {fields.map((f) => (
            <input
              key={f.key}
              value={it[f.key] ?? ''}
              onChange={(e) => update(i, f.key, e.target.value)}
              placeholder={f.placeholder}
              className="cms-field"
              style={{ height: 34, flex: f.width ? 'none' : 1, width: f.width }}
            />
          ))}
          <button
            type="button"
            onClick={() => remove(i)}
            title="Remove"
            className="cms-lift"
            style={{ width: 30, height: 30, border: '1px solid var(--line-2)', borderRadius: 7, color: 'var(--t4)', background: 'none', cursor: 'pointer', flex: 'none' }}
          >
            ✕
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        style={{ alignSelf: 'flex-start', height: 32, padding: '0 13px', border: '1px dashed #3a3f45', borderRadius: 8, color: 'var(--t3)', background: 'none', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit' }}
      >
        {addLabel}
      </button>
    </div>
  );
}
