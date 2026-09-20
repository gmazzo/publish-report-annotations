if [ ! -d "samples" ]; then
  echo "samples directory not found. Make sure to also checkout submodules, run `git submodule update`"
  exit 1
fi

vitest run "$@"
