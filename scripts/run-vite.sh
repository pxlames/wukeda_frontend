#!/usr/bin/env bash

set -euo pipefail

supports_vite6() {
  local major="$1"
  case "$major" in
    18|20) return 0 ;;
    *)
      if [ "$major" -ge 22 ] 2>/dev/null; then
        return 0
      fi
      return 1
      ;;
  esac
}

current_major_version() {
  node -p "process.versions.node.split('.')[0]"
}

ensure_supported_node() {
  if command -v node >/dev/null 2>&1; then
    local major
    major="$(current_major_version)"
    if supports_vite6 "$major"; then
      return 0
    fi
  fi

  if [ -n "${NVM_DIR:-}" ] && [ -s "${NVM_DIR}/nvm.sh" ]; then
    # shellcheck source=/dev/null
    . "${NVM_DIR}/nvm.sh"
  elif [ -s "${HOME}/.nvm/nvm.sh" ]; then
    export NVM_DIR="${HOME}/.nvm"
    # shellcheck source=/dev/null
    . "${NVM_DIR}/nvm.sh"
  fi

  if command -v nvm >/dev/null 2>&1 && [ -f ".nvmrc" ]; then
    nvm use >/dev/null
  fi

  if command -v node >/dev/null 2>&1; then
    local major
    major="$(current_major_version)"
    if supports_vite6 "$major"; then
      return 0
    fi
  fi

  echo "Error: Vite 6 requires Node ^18 || ^20 || >=22." >&2
  echo "Current node: $(command -v node >/dev/null 2>&1 && node -v || echo 'not found')" >&2
  echo "Tip: install a supported Node version and run 'nvm use' in this project." >&2
  exit 1
}

ensure_supported_node

exec node ./node_modules/vite/bin/vite.js "$@"
