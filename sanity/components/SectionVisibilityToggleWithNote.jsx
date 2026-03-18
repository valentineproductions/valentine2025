import React from 'react';
import { Stack, Text } from '@sanity/ui';

export default function SectionVisibilityToggleWithNote(props) {
  const { value, schemaType, renderDefault } = props;
  const sectionName = schemaType?.options?.sectionName || 'This section';
  const isVisible = value !== false;

  const statusMessage = isVisible
    ? `${sectionName} will be displayed.`
    : `${sectionName} will not be displayed (even if it has content below).`;

  return (
    <Stack space={2}>
      {renderDefault(props)}
      <Text size={1} muted>
        {statusMessage}
      </Text>
    </Stack>
  );
}
