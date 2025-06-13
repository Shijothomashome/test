// export const calculateVariantPrice = (variantGeneration, attributes) => {
//   let basePrice = variantGeneration.basePrice || 0;
//   let sellingPrice = basePrice;
//   let mrp = basePrice * 1.2;

//   console.log('Calculating price for attributes:', JSON.stringify(attributes));
//   console.log('Base price:', basePrice);

//   if (variantGeneration.priceStrategy === 'custom' && variantGeneration.priceRules) {
//     for (const rule of variantGeneration.priceRules) {
//       console.log('Checking rule:', rule);
//       const shouldApply = evaluateCondition(rule.condition, attributes);
//       console.log('Rule applies:', shouldApply);
      
//       if (shouldApply) {
//         if (rule.adjustmentType === 'fixed') {
//           const amount = parseFloat(rule.adjustment.replace(/[+-]/g, ''));
//           if (rule.adjustment.startsWith('+')) {
//             sellingPrice += amount;
//           } else {
//             sellingPrice -= amount;
//           }
//         } else if (rule.adjustmentType === 'percentage') {
//           const percent = parseFloat(rule.adjustment.replace(/[+%]/g, '')) / 100;
//           if (rule.adjustment.startsWith('+')) {
//             sellingPrice *= (1 + percent);
//           } else {
//             sellingPrice *= (1 - percent);
//           }
//         }
//         console.log('New selling price after rule:', sellingPrice);
//       }
//     }
//   }

//   // Ensure MRP is always >= selling price
//   mrp = Math.max(mrp, sellingPrice);
  
//   console.log('Final prices - MRP:', mrp, 'Selling:', sellingPrice);
//   return { mrp, sellingPrice };
// };

// export const evaluateCondition = (condition, attributes) => {
//   try {
//     console.log('Evaluating condition:', condition);
//     console.log('Against attributes:', JSON.stringify(attributes, null, 2));
    
//     const match = condition.match(/^([a-zA-Z0-9_]+)\s*(==|!=|>=|<=|>|<)\s*['"]?([^'"]+)['"]?$/);
//     if (!match) {
//       console.log('Condition format invalid');
//       return false;
//     }
    
//     const [_, left, operator, right] = match;
    
//     const attr = attributes.find(a => {
//       // Check both attribute name and ID
//       const attrName = a.attribute?.name || a.name;
//       const attrId = a.attribute?._id?.toString() || a.attribute?.toString();
      
//       return attrName === left.trim() || 
//              attrId === left.trim();
//     });
    
//     if (!attr) {
//       console.log(`Attribute ${left} not found in variant`);
//       return false;
//     }
    
//     const attrValue = attr.value.toString();
//     const compareValue = right.trim();
    
//     console.log(`Comparing: ${attrValue} ${operator} ${compareValue}`);
    
//     switch (operator) {
//       case '==': return attrValue === compareValue;
//       case '!=': return attrValue !== compareValue;
//       case '>': return parseFloat(attrValue) > parseFloat(compareValue);
//       case '<': return parseFloat(attrValue) < parseFloat(compareValue);
//       case '>=': return parseFloat(attrValue) >= parseFloat(compareValue);
//       case '<=': return parseFloat(attrValue) <= parseFloat(compareValue);
//       default: return false;
//     }
//   } catch (e) {
//     console.error('Error evaluating condition:', condition, e);
//     return false;
//   }
// };
// export const calculateVariantStock = (variantGeneration, attributes, defaultStock) => {
//   if (!variantGeneration.stockRules || !variantGeneration.stockRules.length) {
//     return defaultStock;
//   }
  
//   // Check rules in order, return first matching rule's stock value
//   for (const rule of variantGeneration.stockRules) {
//     if (evaluateCondition(rule.condition, attributes)) {
//       return rule.stock;
//     }
//   }
  
//   return defaultStock;
// };

// export const generateVariantCombinations = (attrValuePairs, groupByAttribute = null) => {
//   if (!attrValuePairs || attrValuePairs.length === 0) return [];

//   // Sort attributes to ensure consistent order (groupBy first if specified)
//   const sortedAttributes = [...attrValuePairs];
//   if (groupByAttribute) {
//     sortedAttributes.sort((a, b) => 
//       a.attribute.equals(groupByAttribute) ? -1 : 
//       b.attribute.equals(groupByAttribute) ? 1 : 0
//     );
//   }

//   // Recursive function to generate combinations
//   const generate = (current, remaining) => {
//     if (remaining.length === 0) return [current];
    
//     const nextAttribute = remaining[0];
//     const results = [];
    
//     for (const value of nextAttribute.values) {
//       const newCurrent = [
//         ...current,
//         {
//           attribute: {
//             _id: nextAttribute.attribute,
//             name: nextAttribute.name
//           },
//           value: value
//         }
//       ];
//       results.push(...generate(newCurrent, remaining.slice(1)));
//     }
    
//     return results;
//   };

//   // Generate all combinations
//   const combinations = generate([], sortedAttributes);

//   // Add variant group if specified
//   return combinations.map(combo => {
//     let variantGroup = null;
//     if (groupByAttribute) {
//       const groupAttr = combo.find(a => a.attribute._id.equals(groupByAttribute));
//       if (groupAttr) variantGroup = groupAttr.value;
//     }
//     return {
//       attributes: combo,
//       variantGroup
//     };
//   });
// };



export const generateVariantCombinations = (attrValuePairs, groupByAttribute = null) => {
  if (!attrValuePairs || attrValuePairs.length === 0) return [];

  // Sort attributes to ensure consistent order (groupBy first if specified)
  const sortedAttributes = [...attrValuePairs];
  if (groupByAttribute) {
    sortedAttributes.sort((a, b) => 
      a.attribute.equals(groupByAttribute) ? -1 : 
      b.attribute.equals(groupByAttribute) ? 1 : 0
    );
  }

  // Recursive function to generate combinations
  const generate = (current, remaining) => {
    if (remaining.length === 0) return [current];
    
    const nextAttribute = remaining[0];
    const results = [];
    
    for (const value of nextAttribute.values) {
      const newCurrent = [
        ...current,
        {
          attribute: {
            _id: nextAttribute.attribute,
            name: nextAttribute.name
          },
          value: value
        }
      ];
      results.push(...generate(newCurrent, remaining.slice(1)));
    }
    
    return results;
  };

  // Generate all combinations
  const combinations = generate([], sortedAttributes);

  // Add variant group if specified
  return combinations.map(combo => {
    let variantGroup = null;
    if (groupByAttribute) {
      const groupAttr = combo.find(a => a.attribute._id.equals(groupByAttribute));
      if (groupAttr) variantGroup = groupAttr.value;
    }
    return {
      attributes: combo,
      variantGroup
    };
  });
};

export const calculateVariantPrice = (variantGeneration, attributes) => {
  let basePrice = variantGeneration.basePrice || 0;
  let sellingPrice = basePrice;
  let mrp = basePrice * 1.2;

  if (variantGeneration.priceStrategy === 'custom' && variantGeneration.priceRules) {
    for (const rule of variantGeneration.priceRules) {
      const shouldApply = evaluateCondition(rule.condition, attributes);
      
      if (shouldApply) {
        if (rule.adjustmentType === 'fixed') {
          const amount = parseFloat(rule.adjustment.replace(/[+-]/g, ''));
          if (rule.adjustment.startsWith('+')) {
            sellingPrice += amount;
          } else {
            sellingPrice -= amount;
          }
        } else if (rule.adjustmentType === 'percentage') {
          const percent = parseFloat(rule.adjustment.replace(/[+%]/g, '')) / 100;
          if (rule.adjustment.startsWith('+')) {
            sellingPrice *= (1 + percent);
          } else {
            sellingPrice *= (1 - percent);
          }
        }
      }
    }
  }

  // Ensure MRP is always >= selling price
  mrp = Math.max(mrp, sellingPrice);
  
  return { mrp, sellingPrice };
};

export const evaluateCondition = (condition, attributes) => {
  try {
    const match = condition.match(/^([a-zA-Z0-9_]+)\s*(==|!=|>=|<=|>|<)\s*['"]?([^'"]+)['"]?$/);
    if (!match) return false;
    
    const [_, left, operator, right] = match;
    
    const attr = attributes.find(a => {
      const attrName = a.attribute?.name || a.name;
      const attrId = a.attribute?._id?.toString() || a.attribute?.toString();
      return attrName === left.trim() || attrId === left.trim();
    });
    
    if (!attr) return false;
    
    const attrValue = attr.value.toString();
    const compareValue = right.trim();
    
    switch (operator) {
      case '==': return attrValue === compareValue;
      case '!=': return attrValue !== compareValue;
      case '>': return parseFloat(attrValue) > parseFloat(compareValue);
      case '<': return parseFloat(attrValue) < parseFloat(compareValue);
      case '>=': return parseFloat(attrValue) >= parseFloat(compareValue);
      case '<=': return parseFloat(attrValue) <= parseFloat(compareValue);
      default: return false;
    }
  } catch (e) {
    return false;
  }
};

export const calculateVariantStock = (variantGeneration, attributes, defaultStock) => {
  if (!variantGeneration.stockRules || !variantGeneration.stockRules.length) {
    return defaultStock;
  }
  
  // Check rules in order, return first matching rule's stock value
  for (const rule of variantGeneration.stockRules) {
    if (evaluateCondition(rule.condition, attributes)) {
      return rule.stock;
    }
  }
  
  return defaultStock;
};