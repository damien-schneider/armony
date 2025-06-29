# default recipe to display help information
default:
  @just --list --list-heading $'\n-------------------------------------------\n\n---   Here are the available commands   ---\n\n-------------------------------------------\n\n'

# Remove .next & node_modules & pnpm-lock.yaml & .turbo
[group('clean')]
clean-all:
  @just clean-next
  @just clean-node-modules
  @just clean-lock
  @just clean-turbo

# Remove .next
[group('clean')]
clean-next:
  rm -rf .next

# Remove node_modules
[group('clean')]
clean-node-modules:
  rm -rf node_modules

# Remove pnpm-lock.yaml
[group('clean')]
clean-lock:
  rm -rf pnpm-lock.yaml

# Remove .turbo
[group('clean')]
clean-turbo:
  rm -rf .turbo

# Update supabase types
[group('maintenance')]
update-types:
  turbo run update-types

[group('update')]
package-update-recursive PACKAGE_NAME:
  pnpm up --recursive {{PACKAGE_NAME}}

# Upgrade all the packages in all the monorepo
[group('upgrade')]
upgrade-all:
  pnpm turbo clean
  pnpm up --latest --recursive

# Update all the packages in all the monorepo
[group('update')]
update-all:
  pnpm up --recursive

[group('build')]
build-graph:
  turbo run build --graph=turbo-graph.jpg

# Run turbo build
[group('build')]
build:
  turbo build

# Run pre-commit hooks
[group('maintenance')]
pre-commit:
  @just supabase-build
  pnpm lint
  pnpm biome-check
  pnpm biome-check-error
  pnpm check-types

# Login to supabase, then update types for supabase package & build it
[group('supabase'), working-directory('packages/supabase')]
supabase-update-types-login:
  pnpm supabase login
  pnpm update-types
  pnpm build

# Update types for supabase package & build it
[group('supabase'), working-directory('packages/supabase')]
supabase-update-types:
  pnpm update-types
  pnpm build

# Run turbo build for /packages/**/* only
[group('build')]
build-packages:
  turbo build --filter='./packages/**/*'

# This is a command to build the UI package
[group('build'), working-directory('packages/ui')]
build-ui:
  pnpm build

# Check all
[group('format & lint')]
biome-check:
  pnpm biome check

# Check errors only
[group('format & lint')]
biome-check-error:
  pnpm biome check --error-on-warnings --diagnostic-level=error .

# Apply all suggestions
[group('format & lint')]
biome-write:
  pnpm biome check --write

# Apply all suggestions even unsafe ones
[group('format & lint')]
biome-write-unsafe:
  pnpm biome check --write --unsafe

# Build the supabase package
[group('supabase'), working-directory('packages/supabase')]
supabase-build:
  pnpm build

# Install Stripe CLI
[group('init')]
install-stripe-cli:
  brew install stripe/stripe-cli/stripe

# Reset the shadcn ui package
[group('init'), working-directory('packages/ui')]
init-shadcn-components:
  yes | pnpm dlx shadcn@latest add -y accordion alert alert-dialog aspect-ratio avatar badge breadcrumb button calendar card carousel chart checkbox collapsible command context-menu table dialog drawer dropdown-menu form hover-card input input-otp label menubar navigation-menu pagination popover progress radio-group resizable scroll-area select separator sheet sidebar skeleton slider sonner switch table tabs textarea toggle toggle-group tooltip
