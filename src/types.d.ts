import { KVNamespace } from '@cloudflare/workers-types'

declare global {
  const codex_store: KVNamespace
  type GitHubContentResponse = {
    ad_url: string
    git_url: string
    html_url: string
    name: string
    path: string
    sha: string
    size: number
    type: string
    url: string
  }
}
