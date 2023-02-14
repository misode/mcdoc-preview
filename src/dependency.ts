import type { DownloaderDownloadOut, ProjectInitializer } from '@spyglassmc/core'
import { bufferToString } from '@spyglassmc/core'

export const mcdocLoader: ProjectInitializer = async (ctx) => {
	ctx.meta.registerDependencyProvider('@vanilla-mcdoc', async () => {
		const out: DownloaderDownloadOut = {}
		await ctx.downloader.download<Uint8Array>(
			{
				id: 'mc-je/vanilla-mcdoc.tar.gz',
				uri: 'https://proxy.misode.workers.dev/mcdoc',
				transformer: (b) => b,
				cache: getCacheOptionsBasedOnGitHubCommitSha('SpyglassMC', 'vanilla-mcdoc', 'refs/heads/main'),
				options: GitHubApiDownloadOptions,
				ttl: DownloaderTtl,
			},
			out,
		)

		return {
			info: { startDepth: 1 },
			uri: out.cacheUri!,
		}
	})
}

type GitHubRefResponse =
	| { message: string }
	| { message?: undefined, ref: string, object: { sha: string } }
	| { message?: undefined, ref: string, object: { sha: string } }[]

const DownloaderTtl = 15_000

const GitHubApiDownloadOptions = {
	headers: {
		Accept: 'application/vnd.github.v3+json',
		'User-Agent': 'SpyglassMC',
	},
}

function getCacheOptionsBasedOnGitHubCommitSha(
	owner: string,
	repo: string,
	ref: string,
) {
	return {
		checksumExtension: '.commit-sha' as const,
		checksumJob: {
			uri: `https://api.github.com/repos/${owner}/${repo}/git/${ref}` as const,
			transformer: (buffer: Uint8Array) => {
				const response = JSON.parse(
					bufferToString(buffer),
				) as GitHubRefResponse
				if (Array.isArray(response)) {
					return response[0].object.sha
				} else if (response.message === undefined) {
					return response.object.sha
				} else {
					throw new Error(response.message)
				}
			},
			options: GitHubApiDownloadOptions,
			ttl: DownloaderTtl,
		},
	}
}
