<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: () => {
    return navigateTo('/summary', { replace: true })
  }
})
</script>
