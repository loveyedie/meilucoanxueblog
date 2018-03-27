/**
* Created by Administrator on 2017/12/17.
 */

<template>

  <nav aria-label="Page navigation" class="afly-pager">
  <ul class="pagination">
    <li>
      <router-link :to='"/home?p=" + pager.page > 1 ? pager.page -1 : 1' aria-label="Previous">
        <span aria-hidden="true">&laquo;</span>
      </router-link>
    </li>
    <li v-for="(num, p) in pager.pageArr" :class="num == pager.page ? active : ''">
      <router-link :to='pager.page == num ? "javascript:void(0);": ("/home?p=" + num)'>
        {{num}}
      </router-link>
    </li>
    <li>
      <router-link :to='"/home?p=" + pager.pageCount > pager.page ? pager.page + 1 : pager.pageCount' aria-label="Previous">
        <span aria-hidden="true">&raquo;</span>
      </router-link>
    </li>
  </ul>
</nav>

</template>
<script>
    export default{
        prop:['pager'],
        data(){
          return{}
        },
        components: {},
        mounted(){
        }
    }
</script>
