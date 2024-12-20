interface TreemapItem {
  label: string
  size: number
  percentage: number
  x: number
  y: number
  width: number
  height: number
}

function calculateSquarifiedLayout(
  items: TreemapItem[],
  width: number,
  height: number
): TreemapItem[] {
  const totalSize = items.reduce((sum, item) => sum + item.size, 0)
  
  const scaledItems = items.map(item => ({
    ...item,
    scaledSize: (item.size / totalSize) * (width * height)
  }))
  
  function squarify(
    items: typeof scaledItems,
    row: typeof scaledItems,
    containerWidth: number,
    containerHeight: number,
    x: number,
    y: number
  ): TreemapItem[] {
    if (items.length === 0) {
      return layoutRow(row, containerWidth, x, y)
    }
    
    const currentItem = items[0]
    const remaining = items.slice(1)
    
    if (row.length === 0) {
      return squarify(
        remaining,
        [currentItem],
        containerWidth,
        containerHeight,
        x,
        y
      )
    }
    
    const currentRatio = getWorstRatio(row, containerWidth)
    const newRow = [...row, currentItem]
    const newRatio = getWorstRatio(newRow, containerWidth)
    
    if (newRatio > currentRatio) {
      const layoutedRow = layoutRow(row, containerWidth, x, y)
      const rowSize = row.reduce((sum, item) => sum + item.scaledSize, 0)
      const remainingWidth = containerWidth
      const remainingHeight = containerHeight - (rowSize / containerWidth)
      
      return [
        ...layoutedRow,
        ...squarify(
          items,
          [],
          remainingWidth,
          remainingHeight,
          x,
          y + (rowSize / containerWidth)
        )
      ]
    }
    
    return squarify(
      remaining,
      newRow,
      containerWidth,
      containerHeight,
      x,
      y
    )
  }
  
  function layoutRow(
    row: typeof scaledItems,
    containerWidth: number,
    x: number,
    y: number
  ): TreemapItem[] {
    const rowSize = row.reduce((sum, item) => sum + item.scaledSize, 0)
    let currentX = x
    
    return row.map(item => {
      const itemWidth = (item.scaledSize / rowSize) * containerWidth
      const itemHeight = rowSize / containerWidth
      
      const result = {
        label: item.label,
        size: item.size,
        percentage: item.percentage,
        x: currentX,
        y,
        width: itemWidth - 2,
        height: itemHeight - 2
      }
      
      currentX += itemWidth
      
      return result
    })
  }
  
  function getWorstRatio(
    row: typeof scaledItems,
    containerWidth: number
  ): number {
    if (row.length === 0) return Infinity
    
    const rowSize = row.reduce((sum, item) => sum + item.scaledSize, 0)
    const rowWidth = containerWidth
    const rowHeight = rowSize / containerWidth
    
    let maxRatio = 0
    
    row.forEach(item => {
      const itemWidth = (item.scaledSize / rowSize) * rowWidth
      const itemHeight = rowHeight
      const ratio = Math.max(itemWidth / itemHeight, itemHeight / itemWidth)
      maxRatio = Math.max(maxRatio, ratio)
    })
    
    return maxRatio
  }
  
  return squarify(scaledItems, [], width, height, 0, 0)
}

export { calculateSquarifiedLayout, type TreemapItem }