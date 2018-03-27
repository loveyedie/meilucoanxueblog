/**
* Created by Administrator on 2017/12/17.
 */

<template>
  <ul class="list-inline afly-wedget-toppost">

                    <li>
    [<a href="/c/{{_category._id}}">{{_category.name}}</a>]
                        <a class="afly-link-toppost up" href="/p/{{_id}}" title="{{title}}">{{title}}</a>
  </li>

                </ul>
</template>
<script>
    export default{
        data(){

        },
        components: {},
        mounted(){
        }
    }
</script>
