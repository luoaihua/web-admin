<template>
  <div id="myeditor"></div>
</template>

<script setup>
import E from "wangeditor";
import { onMounted, defineEmits, defineProps } from "vue";
const props = defineProps({
  content: String,
});
const emit = defineEmits(["contentEvent"]);
onMounted(() => {
  const editor = new E("#myeditor");
  editor.create();

  props.content && editor.txt.html(props.content);

  editor.config.onchange = function (newHtml) {
    // console.log(newHtml)
    emit("contentEvent", newHtml);
  };
});
</script>
