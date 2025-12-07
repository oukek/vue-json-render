import { DataField } from '@vue-json-render/shared';

export function inferSchema(data: any, key: string = 'root'): DataField {
  const type = getType(data);
  const field: DataField = {
    key,
    label: key,
    type: type as any,
  };

  if (type === 'object' && data !== null) {
    field.children = Object.keys(data).map(k => inferSchema(data[k], k));
  } else if (type === 'array' && Array.isArray(data)) {
    if (data.length > 0) {
      // Infer schema from the first item
      // Ideally we should merge schemas from all items, but simple inference uses the first one
      const itemSchema = inferSchema(data[0], 'item');
      // For array, children usually describes the item structure
      // If item is object, children matches object properties
      // If item is primitive, children is just that primitive definition?
      // In DataSourceNode, array children are rendered.
      // If we look at DataSourceModal preview generation:
      // if (field.type === 'array' && field.children) { result[field.key] = [generatePreview(field.children)]; }
      // This implies field.children is an ARRAY of fields describing the item object properties?
      // Or is field.children just a single node representing the item type?
      
      // Let's assume standard behavior:
      // If array of objects: children = [ { key: 'prop1'... }, { key: 'prop2'... } ]
      // If array of primitives: children = [ { key: 'item', type: 'string'... } ]?
      
      if (itemSchema.type === 'object' && itemSchema.children) {
        field.children = itemSchema.children;
      } else {
        // Array of primitives
        field.children = [itemSchema];
      }
    } else {
      field.children = [];
    }
  } else {
    // Primitive
    field.mockValue = data;
  }

  return field;
}

function getType(val: any): string {
  if (Array.isArray(val)) return 'array';
  if (val === null) return 'string'; // Default to string for null
  return typeof val;
}
