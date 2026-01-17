import React, { useEffect, useState } from 'react';
import { PatchEvent, set, unset, useClient } from 'sanity';
import { Card, Select, Stack, Text } from '@sanity/ui';

export function LocationSelect(props) {
  const { value, onChange } = props;
  const client = useClient({ apiVersion: '2025-05-19' });
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await client.fetch(`*[_type == "careersPage"][0]{ locations }`);
        if (active) {
          setLocations(data?.locations || []);
          setLoading(false);
        }
      } catch {
        setLocations([]);
        setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const handleChange = (event) => {
    const code = event?.target?.value || '';
    const loc = locations.find(l => l.code === code);
    const next = loc ? { name: loc.name, code: loc.code } : undefined;
    onChange(PatchEvent.from(next ? set(next) : unset()));
  };

  return (
    <Card padding={3} tone="transparent">
      <Stack space={2}>
        <Text muted>{loading ? 'Loading locations…' : 'Select Location'}</Text>
        <Select value={value?.code || ''} onChange={handleChange}>
          <option value="">Select a location</option>
          {locations.map((loc) => (
            <option key={loc.code} value={loc.code}>
              {loc.name} ({loc.code})
            </option>
          ))}
        </Select>
      </Stack>
    </Card>
  );
}

export function CommitmentSelect(props) {
  const { value, onChange } = props;
  const client = useClient({ apiVersion: '2025-05-19' });
  const [commitments, setCommitments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await client.fetch(`*[_type == "careersPage"][0]{ commitments }`);
        if (active) {
          setCommitments(data?.commitments || []);
          setLoading(false);
        }
      } catch {
        setCommitments([]);
        setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const handleChange = (event) => {
    const val = event?.target?.value || '';
    onChange(PatchEvent.from(val ? set(val) : unset()));
  };

  return (
    <Card padding={3} tone="transparent">
      <Stack space={2}>
        <Text muted>{loading ? 'Loading commitments…' : 'Select Commitment'}</Text>
        <Select value={value || ''} onChange={handleChange}>
          <option value="">Select a commitment</option>
          {commitments.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
      </Stack>
    </Card>
  );
}
