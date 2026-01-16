import React, { useEffect, useState } from 'react';
import { PatchEvent, set, unset } from 'sanity';
import { Card, Stack, Text } from '@sanity/ui';

export default function RatingSlider(props) {
  const { value, onChange } = props;
  const [local, setLocal] = useState(typeof value === 'number' ? value : 0);

  useEffect(() => {
    if (typeof value === 'number' && value !== local) {
      setLocal(value);
    }
  }, [value]);

  const handleChange = (event) => {
    const v = parseFloat(event?.target?.value);
    setLocal(v);
    onChange(PatchEvent.from(Number.isFinite(v) ? set(v) : unset()));
  };

  const full = Math.floor(local);
  const hasHalf = (local % 1) >= 0.5 && (local % 1) < 1;
  const empty = 5 - full - (hasHalf ? 1 : 0);
  const stars = '★'.repeat(full) + (hasHalf ? '☆' : '') + '☆'.repeat(Math.max(0, empty));

  return (
    <Card padding={3} tone="transparent">
      <Stack space={3}>
        <Text muted>Use the slider to set a rating (0–5, step 0.5)</Text>
        <input
          type="range"
          min="0"
          max="5"
          step="0.5"
          value={local}
          onChange={handleChange}
          style={{ width: '100%' }}
        />
        <Text>{stars} {local.toFixed(1)} / 5</Text>
      </Stack>
    </Card>
  );
}
