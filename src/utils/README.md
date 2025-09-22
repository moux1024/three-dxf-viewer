# Select 类事件系统

## 概述

`Select` 类继承自 `EventEmitter`，提供了完整的事件系统来监听对象的选择和取消选择状态变化。

## 可用事件

### 1. `select` 事件
当对象被选中时触发。

**参数：** `selectedObjects` - 当前所有已选择对象的数组

**触发时机：**
- 用户点击选择对象时
- 通过代码调用 `select()` 方法时

### 2. `deselect` 事件
当对象被取消选择时触发。

**参数：** `deselectedObjects` - 被取消选择的对象数组

**触发时机：**
- 用户点击已选择的对象时（Ctrl+点击）
- 通过代码调用 `deselect()` 方法时
- 通过代码调用 `deselectAll()` 方法时

## 使用示例

### 基本事件监听

```javascript
import { Select } from './utils/select';

const select = new Select(container, camera, dxf);

// 监听选择事件
select.on('select', (selectedObjects) => {
    console.log('当前选中的对象数量:', selectedObjects.length);
    selectedObjects.forEach(obj => {
        console.log('选中对象:', obj.name || obj.id);
    });
});

// 监听取消选择事件
select.on('deselect', (deselectedObjects) => {
    if (deselectedObjects.length === 0) {
        console.log('所有对象已取消选择');
    } else {
        console.log('取消选择的对象:', deselectedObjects);
    }
});
```

### 在React组件中使用

```jsx
import React, { useEffect, useRef } from 'react';
import { Select } from './utils/select';

const DXFViewer = () => {
    const selectRef = useRef(null);
    const [selectedCount, setSelectedCount] = useState(0);

    useEffect(() => {
        if (selectRef.current) {
            const select = selectRef.current;
            
            // 监听选择状态变化
            const handleSelect = (selectedObjects) => {
                setSelectedCount(selectedObjects.length);
            };
            
            const handleDeselect = (deselectedObjects) => {
                if (deselectedObjects.length === 0) {
                    setSelectedCount(0);
                } else {
                    setSelectedCount(prev => Math.max(0, prev - deselectedObjects.length));
                }
            };

            select.on('select', handleSelect);
            select.on('deselect', handleDeselect);

            // 清理事件监听器
            return () => {
                select.off('select', handleSelect);
                select.off('deselect', handleDeselect);
            };
        }
    }, []);

    return (
        <div>
            <p>当前选中对象数量: {selectedCount}</p>
            {/* 其他组件内容 */}
        </div>
    );
};
```

### 在Vue组件中使用

```vue
<template>
    <div>
        <p>当前选中对象数量: {{ selectedCount }}</p>
        <!-- 其他模板内容 -->
    </div>
</template>

<script>
import { Select } from './utils/select';

export default {
    data() {
        return {
            selectedCount: 0,
            select: null
        };
    },
    mounted() {
        this.select = new Select(this.$refs.container, this.camera, this.dxf);
        
        // 监听选择事件
        this.select.on('select', (selectedObjects) => {
            this.selectedCount = selectedObjects.length;
        });
        
        // 监听取消选择事件
        this.select.on('deselect', (deselectedObjects) => {
            if (deselectedObjects.length === 0) {
                this.selectedCount = 0;
            } else {
                this.selectedCount = Math.max(0, this.selectedCount - deselectedObjects.length);
            }
        });
    },
    beforeUnmount() {
        if (this.select) {
            // 清理事件监听器
            this.select.off('select');
            this.select.off('deselect');
        }
    }
};
</script>
```

## 事件参数说明

### select 事件参数
```javascript
{
    selectedObjects: Array<Object> // 当前所有已选择对象的数组
}
```

### deselect 事件参数
```javascript
{
    deselectObjects: Array<Object> // 被取消选择的对象数组
}
```

**注意：** 当调用 `deselectAll()` 方法时，`deselect` 事件会传递一个空数组 `[]`，表示所有对象都被取消选择。

## 最佳实践

1. **事件清理：** 在组件卸载时记得清理事件监听器，避免内存泄漏
2. **状态同步：** 使用事件来同步UI状态，而不是直接操作Select实例的内部状态
3. **错误处理：** 在事件处理函数中添加适当的错误处理逻辑
4. **性能优化：** 避免在事件处理函数中执行耗时的操作，考虑使用防抖或节流

## 注意事项

- 事件系统基于 `EventEmitter` 实现，支持多个监听器
- 事件参数中的对象是Three.js对象，包含几何体、材质等属性
- 选择状态的变化会立即触发相应事件，无需手动轮询


