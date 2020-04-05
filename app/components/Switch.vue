<template>
  <input type="checkbox" id="switch" class="switch-control"/>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
input[type='checkbox'].switch-control {
  margin-left: -9999px;
  position: absolute;

  & ~ label {
    float: left;
    width: 100%;
    position: relative;
    line-height: 1.75rem;
    margin: 0.2rem 0;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    text-align: left;

    &:before, &:after {
      right: 0;
      position: absolute;
      display: block;
      top: 0;
      bottom: 0;
      content: ' ';
      width: 3.75rem;
      background-color: #C41230;
      border-radius: 3px;
      transition: all 100ms ease-in;
      background-size: 20px 9px;
    }

    &:before {
      border: 1px solid #CFD4D8;
      content: 'BUY';
      text-align: left;
      text-indent: 2.15rem;
      line-height: 3;
      color: #fff;
      font-size: .5rem;
      font-weight: 900;
    }

    &:after {
      right: 1.8rem;
      width: 1.75rem;
      top: 0.2rem;
      bottom: 0.25rem;
      margin-left: 0.2rem;
      background-color: #fff;
      border-radius: 2px;
      box-shadow: 0 .1rem 0 rgba(0,0,0,0.3);
      border: 1px solid #A7A9AC;
      content: '...';
      color: #5F6062;
      font-weight: 900;
      line-height: .7;
      text-align: center;
      font-size: .95rem;
    }
  }

  &:checked {

    & ~ label:before {
      background-color: #8BC300;
      content: 'SELL';
      text-indent: .5rem;
      text-align: left;
    }

    & ~ label:after {
      right: .2rem;
    }
  }
}
</style>
