<template>
  <div>
    <LandingShowcase/>
    <GifCardShowcase/>
    <DownloadApp/>
  </div>
</template>

<script>
// @ is an alias to /src
import GifCardShowcase from "@/components/Landing/GifCardShowcase";
import DownloadApp from "@/components/Landing/DownloadApp";
import LandingShowcase from "@/components/Landing/showcase/LandingShowcase";

export default {
  name: 'Home',
  components: {
    LandingShowcase,
    DownloadApp,
    GifCardShowcase,
  },
}
</script>
