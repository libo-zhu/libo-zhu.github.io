---
title: Java中通过重写comparator接口中的compare方法进行自定义排序
date: 2026-04-06
category: Java基础
categorySlug: java_basic
summary: Java中通过重写comparator接口中的compare方法进行自定义排序
---

# Java中通过重写comparator接口中的compare方法进行自定义排序

- Java中的sort函数可以通过重写compare函数的方式，来自定义排序的方法，如下代码所示。

```
Arrays.sort(nums, new Comparator<Integer>(){
    @Override
    int compare(Integer o1, Integer o2) {
        //根据需求来写
        return o1 - o2;
    };
})
```

- 在java 8后，可以用更简洁的lambda语法，代码如下。

```
Arrays.sort(nums, (o1, o2) -> {
    //具体实现
    return o1 - o2;
});
```

### 其他说明
- compare函数的返回值类型是int,如果它大于0，则o1排在o2之后；如果它小于0，则o1排在o2之前。在上述的例子中，如果需要升序，则return o1 - o2；如果需要降序，则return o2 - o1.