<template>
  <div>
    <div @scroll="onScroll" :id="`PostMain-${post.id}`" class="flex border-b py-6">
      <!-- User interaction elements -->
      <div @click="isLoggedIn(post.user)" class="cursor-pointer"></div>
      <div class="pl-3 w-full px-4">
        <!-- Post header with Follow button -->
        <div class="flex items-center justify-between pb-0.5">
          <button @click="isLoggedIn(post.user)">
            <span class="font-bold hover:underline cursor-pointer">x</span>
            <span class="text-[13px] text-light text-gray-500 pl-1 cursor-pointer">xw</span>
          </button>
          <button class="border text-[15px] px-[21px] py-0.5 border-[#F02C56] text-[#F02C56] hover:bg-[#ffeef2] font-semibold rounded-md">
            Follow
          </button>
        </div>
        <!-- Post tags -->
        <div class="text-[14px] text-gray-500 pb-0.5">#fun #cool #SuperAwesome</div>
        <!-- Music and like information -->
        <div class="text-[14px] pb-0.5 flex items-center font-semibold">
          <Icon name="mdi:music" size="17"/>
          <div class="px-1">original sound - AWESOME</div>
          <Icon name="mdi:heart" size="20"/>
        </div>
        <!-- Video and interaction section -->
        <div class="mt-2.5 flex">
          <div
              @click="displayPost(post)"
              class="relative min-h-[480px] max-h-[580px] max-w-[260px] flex items-center bg-black rounded-xl cursor-pointer"
          >
            <video
                v-if="post.video"
                ref="video"
                loop
                class="rounded-xl object-cover mx-auto h-full"
                :src="post.video"
                @play="isPlaying = true"
                @pause="isPlaying = false"
            />
            <img
                class="absolute right-2 bottom-14"
                width="90"
                src="~/assets/images/tiktok-logo-white.png"
            />
            <button
                v-if="!isPlaying"
                class="play-button"
                @click="togglePlay"
            >
              Play
            </button>
          </div>
          <!-- Post actions (like, comment, share) -->
          <div class="relative mr-[75px]">
            <!-- ... Like, Comment, Share buttons ... -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { $generalStore, $userStore } = useNuxtApp()
const props = defineProps(['post'])
const { post } = toRefs(props)

const router = useRouter()

let video = ref(null)



onMounted(() => {
  // Unlocking audio context with user interaction
  document.addEventListener('click', unlockAudioContext, {once: true});

  function unlockAudioContext() {
    // Your existing unlock code goes here
  }

  let observer = new IntersectionObserver(function(entries) {
    if (entries[0].isIntersecting) {
      console.log('Element is playing' + post.value.id);
      video.value.play().catch(e => {
        console.log('Error playing video: ', e);
        // Handle error or prompt user for interaction
      });
    } else {
      console.log('Element is paused' + post.value.id);
      video.value.pause();
    }
  }, { threshold: [0.6] });

  observer.observe(document.getElementById(`PostMain-${post.value.id}`));
});


let isPlaying = ref(false);


const togglePlay = () => {
  if (video.value.paused) {
    video.value.play();
  } else {
    video.value.pause();
  }
};


onBeforeUnmount(() => {
    video.value.pause()
    video.value.currentTime = 0
    video.value.src = ''
})

const isLiked = computed(() => {
    let res = post.value.likes.find(like => like.user_id === $userStore.id)
    if (res) {
        return true
    }
    return false
})


const scrollContainer = ref(null)

const loadMorePosts = async () => {
  try {
    await $userStore.loadMorePosts()
    console.log('load more posts')
  } catch (error) {
    console.log(error)
  }
}
const onScroll = (event) => {
  const {
    target: { scrollTop, clientHeight, scrollHeight },
  } = event

  if (scrollTop + clientHeight >= scrollHeight) {
    loadMorePosts()
     console.log('load more posts');
  }
}




const likePost = async (post) => {
    if (!$userStore.id) {
        $generalStore.isLoginOpen = true
        return
    }
    try {
        await $userStore.likePost(post)
    } catch (error) {
        console.log(error)
    }
}



const unlikePost = async (post) => {
    if (!$userStore.id) {
        $generalStore.isLoginOpen = true
        return
    }
    try {
        await $userStore.unlikePost(post, false)
    } catch (error) {
        console.log(error)
    }
}

const isLoggedIn = (user) => {
    if (!$userStore.id) {
        $generalStore.isLoginOpen = true
        return
    }
    setTimeout(() => router.push(`/profile/${user.id}`), 200)
}

const displayPost = (post) => {


    $generalStore.setBackUrl('/')
    $generalStore.selectedPost = null
    setTimeout(() => router.push(`/post/${post.id}`), 200)
}
</script>
