
# dva的微简化版
a simple dva

### 解决
- 从dispatch action到 effects到 reducer 以及services 四个步子一步解决
- 免去从dispatch action到 effects到 reducer 以及services 四个方法命名
- 免去写effect逻辑，reducer逻辑，services逻辑
- 只用维护一个model

### 思路(一期)
- 保留dva最根本的数据流
- 用一个model命名空间代替store；
- 原本的model（ namespace ）降维为store这个model的一个属性；
- 用一个公共方法处理全部effects
- 用一个公共方法处理全部reducers
- 使用字符串'a.b.c'作为state目标层级
- 使用字符串'a.b.c'作为reducer请求结果层级



