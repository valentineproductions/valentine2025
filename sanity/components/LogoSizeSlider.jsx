import React, { useEffect, useState } from 'react';
import { PatchEvent, set } from 'sanity';
import { Card, Stack, Text } from '@sanity/ui';

export default function LogoSizeSlider(props) {
  const { value, onChange } = props;
  const [local, setLocal] = useState(typeof value === 'number' ? value : 33);

  useEffect(() => {
    if (typeof value === 'number' && value !== local) {
      setLocal(value);
    }
  }, [value, local]);

  const handleChange = (event) => {
    const next = Number(event?.target?.value);
    if (!Number.isFinite(next)) return;
    setLocal(next);
    onChange(PatchEvent.from(set(next)));
  };

  return (
    <Card padding={3} tone="transparent">
      <Stack space={3}>
        {/* <Text muted>Size of logo 20% to 100% //33% is default</Text> */}
        <input
          type="range"
          min="20"
          max="100"
          step="1"
          value={local}
          onChange={handleChange}
          style={{ width: '100%' }}
        />
        <Text>{local}%</Text>
      </Stack>
    </Card>
  );
}
