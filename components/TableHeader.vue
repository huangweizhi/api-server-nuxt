<template>
  <div class="table-header">
    <div class="left">
      <slot name="left"></slot>
    </div>
    <div>
      <slot name="right"></slot>
    </div>
  </div>
</template>

<style>
.table-header {
  margin: 1rem 0 0.5rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.left span {
  font-weight: 700;
}
</style>
