<template>
	<div class="afly-body-bg">
        <div class="afly-wrapper">
            <nav-header></nav-header>
            <section>
                <transition name="fade" mode="out-in">
                    <keep-alive > 
                        <router-view></router-view>
                    </keep-alive>
                </transition>
            </section>
            
            <nav-footer></nav-footer>
                
        </div>
    </div>
</template>
<script>
import NavHeader from './components/NavHeader'
import NavFooter  from './components/NavFooter'

export default {
  name: 'front',
  components: {
    NavHeader,
    NavFooter
  },
  computed: {
    
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
	
</style>