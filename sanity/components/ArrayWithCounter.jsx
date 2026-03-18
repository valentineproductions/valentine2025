import React from 'react';

export default function ArrayWithCounter(props) {
  const { schemaType, value, renderDefault } = props;
  const count = Array.isArray(value) ? value.length : 0;
  
  // Determine the item type name based on schema
  const itemType = schemaType.of?.[0]?.type || 'items';
  const itemName = itemType === 'image' ? 'images' : 
                   itemType === 'object' ? 'videos' : 
                   'items';

  // Update the description dynamically
  const baseDescription = schemaType.description || '';
  const descriptionWithoutCounter = baseDescription.split('Total #')[0].trim();
  const updatedDescription = `${descriptionWithoutCounter} Total ${count} ${itemName}.`;
  
  // Create a new schema type with updated description
  const schemaTypeWithCounter = {
    ...schemaType,
    description: updatedDescription
  };

  // Render default field UI while overriding the displayed description text.
  return renderDefault({
    ...props,
    schemaType: schemaTypeWithCounter,
    description: updatedDescription
  });
}
