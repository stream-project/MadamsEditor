<template>
  <nav class="navbar navbar-dark bg-dark">
    <a class="navbar-brand" href="#">
      <img src="logo-header.png" height=40 alt="MADAMS EDITOR" loading="lazy">
    </a>

    <a class="nav-link btn btn-primary" id="convert-btn" href="#" title="Apply Mapping (Ctrl + Enter)" style="color: #fff !important;">
      <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-caret-right-fill" fill="currentColor"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12.14 8.753l-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
      </svg>
      <span class="loader spinner-border spinner-border-sm d-none" role="status" aria-hidden="true"></span>
      Run
    </a>
  </nav>
</template>

<script>

export default {
    name: 'navbar'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
nav {
  height: 60px;
}
</style>
