<template>
  <q-layout view="lHh Lpr lFf">
	<q-header>
	  <q-toolbar>
		<q-btn
		  flat
		  dense
		  round
		  icon="menu"
		  aria-label="Menu"
		  @click="toggleLeftDrawer"
		/>
	  </q-toolbar>
	  <div class="q-px-lg q-pt-xl q-mb-md">
		<div class="text-h3">Todo</div>
		<div class="text-subtitle1">{{ todaysDate }}</div>
	  </div>
	  <q-img src="/montagnes.jpg" class="header-image absolute-top"/>
	</q-header>

	 <q-drawer
		v-model="leftDrawerOpen"
		:width="250"
		:breakpoint="600"
	  >
		<q-scroll-area style="height: calc(100% - 192px); margin-top: 192px; border-right: 1px solid #ddd">
		  	<q-list padding>

				<q-item to="/" exact clickable v-ripple>
			  		<q-item-section avatar>
						<q-icon name="list"/>
			  		</q-item-section>
			  		<q-item-section>To-do</q-item-section>
				</q-item>

				<q-item to="/help" exact clickable v-ripple>
			  		<q-item-section avatar>
						<q-icon name="help"/>
			  		</q-item-section>
			  		<q-item-section>Aide</q-item-section>
				</q-item>

				<q-item to="/techno1" exact clickable v-ripple>
			  		<q-item-section avatar>
						<q-icon name="looks_one"/>
			  		</q-item-section>
			  		<q-item-section>Accès Techno 1</q-item-section>
				</q-item>

		  </q-list>
		</q-scroll-area>

		<q-img class="absolute-top" src="/montagnes.jpg" style="height: 192px">
		  	<div class="absolute-bottom bg-transparent">
				<q-avatar size="56px" class="q-mb-sm">
			  		<img src="https://avatars.githubusercontent.com/u/1468048284?v=4">
				</q-avatar>
				<div class="text-weight-bold">David ZENARI</div>
				<div>@dzenari</div>
		  </div>
		</q-img>
	  </q-drawer>

	<q-page-container>
		<router-view v-slot="{ Component }">
			<KeepAlive>
				<component :is="Component" />
			</KeepAlive>
		</router-view>
	</q-page-container>
  </q-layout>
</template>

<script setup>
import { date } from 'quasar'
import { ref, computed } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'

const linksList = [
  {
	title: 'Docs',
	caption: 'quasar.dev',
	icon: 'school',
	link: 'https://quasar.dev'
  },
  {
	title: 'Github',
	caption: 'github.com/quasarframework',
	icon: 'code',
	link: 'https://github.com/quasarframework'
  },
  {
	title: 'Discord Chat Channel',
	caption: 'chat.quasar.dev',
	icon: 'chat',
	link: 'https://chat.quasar.dev'
  },
  {
	title: 'Forum',
	caption: 'forum.quasar.dev',
	icon: 'record_voice_over',
	link: 'https://forum.quasar.dev'
  },
  {
	title: 'Twitter',
	caption: '@quasarframework',
	icon: 'rss_feed',
	link: 'https://twitter.quasar.dev'
  },
  {
	title: 'Facebook',
	caption: '@QuasarFramework',
	icon: 'public',
	link: 'https://facebook.quasar.dev'
  },
  {
	title: 'Quasar Awesome',
	caption: 'Community Quasar projects',
	icon: 'favorite',
	link: 'https://awesome.quasar.dev'
  }
]

const todaysDate = computed(() => {
  const days = [
	'Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'
  ]
  const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']

  const date = new Date()
  const dayName = days[date.getDay()]
  const day = date.getDate()
  const monthName = months[date.getMonth()]
  const year = date.getFullYear()

  return `${dayName} ${day} ${monthName} ${year}`
})

const leftDrawerOpen = ref(false)

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
<style lang="scss">
.header-image {
  height: 100%;
  z-index: -1;
  opacity: 0.2;
  filter: grayscale(100%);
}
</style>
