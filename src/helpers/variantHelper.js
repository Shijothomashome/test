export function generateVariantCombinations(attributes, groupByAttrId = null) {
    const combinations = [];
    
    function generate(index, current, groupValue) {
        if (index === attributes.length) {
            combinations.push({
                attributes: [...current],
                variantGroup: groupValue
            });
            return;
        }
        
        const attr = attributes[index];
        const isGroupAttr = groupByAttrId && attr.attribute.equals(groupByAttrId);
        
        for (const value of attr.values) {
            const newCurrent = [...current, {
                attribute: attr.attribute,
                value: value
            }];
            
            const newGroupValue = isGroupAttr ? value : groupValue;
            generate(index + 1, newCurrent, newGroupValue);
        }
    }
    
    generate(0, [], null);
    return combinations;
}