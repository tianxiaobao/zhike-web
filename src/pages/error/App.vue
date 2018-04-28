<template>
  <div id="app">
    <div class="content">
        <div class="icon">
            <img src="../../assets/404.png">
        </div>
        <div class="text">
            <div class="title">错误,</div>
            <div class="detail">{{ errMsg }}</div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
    name: "app",
    data () {
        return {
            errMsg
        };
    }
};
</script>

<style scoped>
body {
  background-color: #fff;
  height: 100%;
}
#id {
  position: relative;
  height: 100%;
}
.content {
  width: 600px;
  position: absolute;
  left: 50%;
  top: 45%;
  transform: translate(-50%, -50%);
}
.content::after {
  content: '';
  display: block;
  height: 0;
  clear: both;
}
.icon,.text {
  float: left;
}
.icon {
  width: 220px;
}
.icon>img {
  width: 100%;
}
.text {
  width: 340px;
  padding-left: 40px;
}
.title {
  font-size: 46px;
  font-weight: normal;
  color: #06AEF1;
  display: inline;
  font-family: Arial;
  letter-spacing: 5px;
}
.detail {
  padding: 10px 0;
  color: #5e8279;
}
</style>
