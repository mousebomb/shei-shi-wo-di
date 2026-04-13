/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ActiveTasksResponse } from '../models/ActiveTasksResponse';
import type { ApplyEffectsRequest } from '../models/ApplyEffectsRequest';
import type { AudioChannelCreate } from '../models/AudioChannelCreate';
import type { AudioChannelResponse } from '../models/AudioChannelResponse';
import type { AudioChannelUpdate } from '../models/AudioChannelUpdate';
import type { AvailableEffectsResponse } from '../models/AvailableEffectsResponse';
import type { Body_add_profile_sample_profiles__profile_id__samples_post } from '../models/Body_add_profile_sample_profiles__profile_id__samples_post';
import type { Body_import_generation_history_import_post } from '../models/Body_import_generation_history_import_post';
import type { Body_import_profile_profiles_import_post } from '../models/Body_import_profile_profiles_import_post';
import type { Body_transcribe_audio_transcribe_post } from '../models/Body_transcribe_audio_transcribe_post';
import type { Body_upload_profile_avatar_profiles__profile_id__avatar_post } from '../models/Body_upload_profile_avatar_profiles__profile_id__avatar_post';
import type { ChannelVoiceAssignment } from '../models/ChannelVoiceAssignment';
import type { EffectPresetCreate } from '../models/EffectPresetCreate';
import type { EffectPresetResponse } from '../models/EffectPresetResponse';
import type { EffectPresetUpdate } from '../models/EffectPresetUpdate';
import type { FilesystemHealthResponse } from '../models/FilesystemHealthResponse';
import type { GenerationRequest } from '../models/GenerationRequest';
import type { GenerationResponse } from '../models/GenerationResponse';
import type { GenerationVersionResponse } from '../models/GenerationVersionResponse';
import type { HealthResponse } from '../models/HealthResponse';
import type { HistoryListResponse } from '../models/HistoryListResponse';
import type { HistoryResponse } from '../models/HistoryResponse';
import type { ModelDownloadRequest } from '../models/ModelDownloadRequest';
import type { ModelMigrateRequest } from '../models/ModelMigrateRequest';
import type { ModelStatusListResponse } from '../models/ModelStatusListResponse';
import type { ProfileChannelAssignment } from '../models/ProfileChannelAssignment';
import type { ProfileEffectsUpdate } from '../models/ProfileEffectsUpdate';
import type { ProfileSampleResponse } from '../models/ProfileSampleResponse';
import type { ProfileSampleUpdate } from '../models/ProfileSampleUpdate';
import type { StoryCreate } from '../models/StoryCreate';
import type { StoryDetailResponse } from '../models/StoryDetailResponse';
import type { StoryItemBatchUpdate } from '../models/StoryItemBatchUpdate';
import type { StoryItemCreate } from '../models/StoryItemCreate';
import type { StoryItemDetail } from '../models/StoryItemDetail';
import type { StoryItemMove } from '../models/StoryItemMove';
import type { StoryItemReorder } from '../models/StoryItemReorder';
import type { StoryItemSplit } from '../models/StoryItemSplit';
import type { StoryItemTrim } from '../models/StoryItemTrim';
import type { StoryItemVersionUpdate } from '../models/StoryItemVersionUpdate';
import type { StoryResponse } from '../models/StoryResponse';
import type { TranscriptionResponse } from '../models/TranscriptionResponse';
import type { VoiceProfileCreate } from '../models/VoiceProfileCreate';
import type { VoiceProfileResponse } from '../models/VoiceProfileResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DefaultService {
    /**
     * Root
     * Root endpoint — serves SPA index.html in Docker, JSON otherwise.
     * @returns any Successful Response
     * @throws ApiError
     */
    public static rootGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/',
        });
    }
    /**
     * Shutdown
     * Gracefully shutdown the server.
     * @returns any Successful Response
     * @throws ApiError
     */
    public static shutdownShutdownPost(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/shutdown',
        });
    }
    /**
     * Watchdog Disable
     * Disable the parent process watchdog so the server keeps running.
     * @returns any Successful Response
     * @throws ApiError
     */
    public static watchdogDisableWatchdogDisablePost(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/watchdog/disable',
        });
    }
    /**
     * Health
     * Health check endpoint.
     * @returns HealthResponse Successful Response
     * @throws ApiError
     */
    public static healthHealthGet(): CancelablePromise<HealthResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/health',
        });
    }
    /**
     * Filesystem Health
     * Check filesystem health: directory existence, write permissions, and disk space.
     * @returns FilesystemHealthResponse Successful Response
     * @throws ApiError
     */
    public static filesystemHealthHealthFilesystemGet(): CancelablePromise<FilesystemHealthResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/health/filesystem',
        });
    }
    /**
     * List Profiles
     * List all voice profiles.
     * @returns VoiceProfileResponse Successful Response
     * @throws ApiError
     */
    public static listProfilesProfilesGet(): CancelablePromise<Array<VoiceProfileResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/profiles',
        });
    }
    /**
     * Create Profile
     * Create a new voice profile.
     * @param requestBody
     * @returns VoiceProfileResponse Successful Response
     * @throws ApiError
     */
    public static createProfileProfilesPost(
        requestBody: VoiceProfileCreate,
    ): CancelablePromise<VoiceProfileResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/profiles',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Import Profile
     * Import a voice profile from a ZIP archive.
     * @param formData
     * @returns VoiceProfileResponse Successful Response
     * @throws ApiError
     */
    public static importProfileProfilesImportPost(
        formData: Body_import_profile_profiles_import_post,
    ): CancelablePromise<VoiceProfileResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/profiles/import',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Profile
     * Get a voice profile by ID.
     * @param profileId
     * @returns VoiceProfileResponse Successful Response
     * @throws ApiError
     */
    public static getProfileProfilesProfileIdGet(
        profileId: string,
    ): CancelablePromise<VoiceProfileResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/profiles/{profile_id}',
            path: {
                'profile_id': profileId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Profile
     * Update a voice profile.
     * @param profileId
     * @param requestBody
     * @returns VoiceProfileResponse Successful Response
     * @throws ApiError
     */
    public static updateProfileProfilesProfileIdPut(
        profileId: string,
        requestBody: VoiceProfileCreate,
    ): CancelablePromise<VoiceProfileResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/profiles/{profile_id}',
            path: {
                'profile_id': profileId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Profile
     * Delete a voice profile.
     * @param profileId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deleteProfileProfilesProfileIdDelete(
        profileId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/profiles/{profile_id}',
            path: {
                'profile_id': profileId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Add Profile Sample
     * Add a sample to a voice profile.
     * @param profileId
     * @param formData
     * @returns ProfileSampleResponse Successful Response
     * @throws ApiError
     */
    public static addProfileSampleProfilesProfileIdSamplesPost(
        profileId: string,
        formData: Body_add_profile_sample_profiles__profile_id__samples_post,
    ): CancelablePromise<ProfileSampleResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/profiles/{profile_id}/samples',
            path: {
                'profile_id': profileId,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Profile Samples
     * Get all samples for a profile.
     * @param profileId
     * @returns ProfileSampleResponse Successful Response
     * @throws ApiError
     */
    public static getProfileSamplesProfilesProfileIdSamplesGet(
        profileId: string,
    ): CancelablePromise<Array<ProfileSampleResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/profiles/{profile_id}/samples',
            path: {
                'profile_id': profileId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Profile Sample
     * Delete a profile sample.
     * @param sampleId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deleteProfileSampleProfilesSamplesSampleIdDelete(
        sampleId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/profiles/samples/{sample_id}',
            path: {
                'sample_id': sampleId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Profile Sample
     * Update a profile sample's reference text.
     * @param sampleId
     * @param requestBody
     * @returns ProfileSampleResponse Successful Response
     * @throws ApiError
     */
    public static updateProfileSampleProfilesSamplesSampleIdPut(
        sampleId: string,
        requestBody: ProfileSampleUpdate,
    ): CancelablePromise<ProfileSampleResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/profiles/samples/{sample_id}',
            path: {
                'sample_id': sampleId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Upload Profile Avatar
     * Upload or update avatar image for a profile.
     * @param profileId
     * @param formData
     * @returns VoiceProfileResponse Successful Response
     * @throws ApiError
     */
    public static uploadProfileAvatarProfilesProfileIdAvatarPost(
        profileId: string,
        formData: Body_upload_profile_avatar_profiles__profile_id__avatar_post,
    ): CancelablePromise<VoiceProfileResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/profiles/{profile_id}/avatar',
            path: {
                'profile_id': profileId,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Profile Avatar
     * Get avatar image for a profile.
     * @param profileId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getProfileAvatarProfilesProfileIdAvatarGet(
        profileId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/profiles/{profile_id}/avatar',
            path: {
                'profile_id': profileId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Profile Avatar
     * Delete avatar image for a profile.
     * @param profileId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deleteProfileAvatarProfilesProfileIdAvatarDelete(
        profileId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/profiles/{profile_id}/avatar',
            path: {
                'profile_id': profileId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Export Profile
     * Export a voice profile as a ZIP archive.
     * @param profileId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static exportProfileProfilesProfileIdExportGet(
        profileId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/profiles/{profile_id}/export',
            path: {
                'profile_id': profileId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Profile Channels
     * Get list of channel IDs assigned to a profile.
     * @param profileId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getProfileChannelsProfilesProfileIdChannelsGet(
        profileId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/profiles/{profile_id}/channels',
            path: {
                'profile_id': profileId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Set Profile Channels
     * Set which channels a profile is assigned to.
     * @param profileId
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static setProfileChannelsProfilesProfileIdChannelsPut(
        profileId: string,
        requestBody: ProfileChannelAssignment,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/profiles/{profile_id}/channels',
            path: {
                'profile_id': profileId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Profile Effects
     * Set or clear the default effects chain for a voice profile.
     * @param profileId
     * @param requestBody
     * @returns VoiceProfileResponse Successful Response
     * @throws ApiError
     */
    public static updateProfileEffectsProfilesProfileIdEffectsPut(
        profileId: string,
        requestBody: ProfileEffectsUpdate,
    ): CancelablePromise<VoiceProfileResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/profiles/{profile_id}/effects',
            path: {
                'profile_id': profileId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Channels
     * List all audio channels.
     * @returns AudioChannelResponse Successful Response
     * @throws ApiError
     */
    public static listChannelsChannelsGet(): CancelablePromise<Array<AudioChannelResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/channels',
        });
    }
    /**
     * Create Channel
     * Create a new audio channel.
     * @param requestBody
     * @returns AudioChannelResponse Successful Response
     * @throws ApiError
     */
    public static createChannelChannelsPost(
        requestBody: AudioChannelCreate,
    ): CancelablePromise<AudioChannelResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/channels',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Channel
     * Get an audio channel by ID.
     * @param channelId
     * @returns AudioChannelResponse Successful Response
     * @throws ApiError
     */
    public static getChannelChannelsChannelIdGet(
        channelId: string,
    ): CancelablePromise<AudioChannelResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/channels/{channel_id}',
            path: {
                'channel_id': channelId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Channel
     * Update an audio channel.
     * @param channelId
     * @param requestBody
     * @returns AudioChannelResponse Successful Response
     * @throws ApiError
     */
    public static updateChannelChannelsChannelIdPut(
        channelId: string,
        requestBody: AudioChannelUpdate,
    ): CancelablePromise<AudioChannelResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/channels/{channel_id}',
            path: {
                'channel_id': channelId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Channel
     * Delete an audio channel.
     * @param channelId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deleteChannelChannelsChannelIdDelete(
        channelId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/channels/{channel_id}',
            path: {
                'channel_id': channelId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Channel Voices
     * Get list of profile IDs assigned to a channel.
     * @param channelId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getChannelVoicesChannelsChannelIdVoicesGet(
        channelId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/channels/{channel_id}/voices',
            path: {
                'channel_id': channelId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Set Channel Voices
     * Set which voices are assigned to a channel.
     * @param channelId
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static setChannelVoicesChannelsChannelIdVoicesPut(
        channelId: string,
        requestBody: ChannelVoiceAssignment,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/channels/{channel_id}/voices',
            path: {
                'channel_id': channelId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Generate Speech
     * Generate speech from text using a voice profile.
     * @param requestBody
     * @returns GenerationResponse Successful Response
     * @throws ApiError
     */
    public static generateSpeechGeneratePost(
        requestBody: GenerationRequest,
    ): CancelablePromise<GenerationResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/generate',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Retry Generation
     * Retry a failed generation using the same parameters.
     * @param generationId
     * @returns GenerationResponse Successful Response
     * @throws ApiError
     */
    public static retryGenerationGenerateGenerationIdRetryPost(
        generationId: string,
    ): CancelablePromise<GenerationResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/generate/{generation_id}/retry',
            path: {
                'generation_id': generationId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Regenerate Generation
     * Re-run TTS with the same parameters and save the result as a new version.
     * @param generationId
     * @returns GenerationResponse Successful Response
     * @throws ApiError
     */
    public static regenerateGenerationGenerateGenerationIdRegeneratePost(
        generationId: string,
    ): CancelablePromise<GenerationResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/generate/{generation_id}/regenerate',
            path: {
                'generation_id': generationId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Generation Status
     * SSE endpoint that streams generation status updates.
     * @param generationId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getGenerationStatusGenerateGenerationIdStatusGet(
        generationId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/generate/{generation_id}/status',
            path: {
                'generation_id': generationId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Stream Speech
     * Generate speech and stream the WAV audio directly without saving to disk.
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static streamSpeechGenerateStreamPost(
        requestBody: GenerationRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/generate/stream',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List History
     * List generation history with optional filters.
     * @param profileId
     * @param search
     * @param limit
     * @param offset
     * @returns HistoryListResponse Successful Response
     * @throws ApiError
     */
    public static listHistoryHistoryGet(
        profileId?: (string | null),
        search?: (string | null),
        limit: number = 50,
        offset?: number,
    ): CancelablePromise<HistoryListResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/history',
            query: {
                'profile_id': profileId,
                'search': search,
                'limit': limit,
                'offset': offset,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Stats
     * Get generation statistics.
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getStatsHistoryStatsGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/history/stats',
        });
    }
    /**
     * Import Generation
     * Import a generation from a ZIP archive.
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    public static importGenerationHistoryImportPost(
        formData: Body_import_generation_history_import_post,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/history/import',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Generation
     * Get a generation by ID.
     * @param generationId
     * @returns HistoryResponse Successful Response
     * @throws ApiError
     */
    public static getGenerationHistoryGenerationIdGet(
        generationId: string,
    ): CancelablePromise<HistoryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/history/{generation_id}',
            path: {
                'generation_id': generationId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Generation
     * Delete a generation.
     * @param generationId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deleteGenerationHistoryGenerationIdDelete(
        generationId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/history/{generation_id}',
            path: {
                'generation_id': generationId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Toggle Favorite
     * Toggle the favorite status of a generation.
     * @param generationId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static toggleFavoriteHistoryGenerationIdFavoritePost(
        generationId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/history/{generation_id}/favorite',
            path: {
                'generation_id': generationId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Export Generation
     * Export a generation as a ZIP archive.
     * @param generationId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static exportGenerationHistoryGenerationIdExportGet(
        generationId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/history/{generation_id}/export',
            path: {
                'generation_id': generationId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Export Generation Audio
     * Export only the audio file from a generation.
     * @param generationId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static exportGenerationAudioHistoryGenerationIdExportAudioGet(
        generationId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/history/{generation_id}/export-audio',
            path: {
                'generation_id': generationId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Transcribe Audio
     * Transcribe audio file to text.
     * @param formData
     * @returns TranscriptionResponse Successful Response
     * @throws ApiError
     */
    public static transcribeAudioTranscribePost(
        formData: Body_transcribe_audio_transcribe_post,
    ): CancelablePromise<TranscriptionResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/transcribe',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Stories
     * List all stories.
     * @returns StoryResponse Successful Response
     * @throws ApiError
     */
    public static listStoriesStoriesGet(): CancelablePromise<Array<StoryResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/stories',
        });
    }
    /**
     * Create Story
     * Create a new story.
     * @param requestBody
     * @returns StoryResponse Successful Response
     * @throws ApiError
     */
    public static createStoryStoriesPost(
        requestBody: StoryCreate,
    ): CancelablePromise<StoryResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/stories',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Story
     * Get a story with all its items.
     * @param storyId
     * @returns StoryDetailResponse Successful Response
     * @throws ApiError
     */
    public static getStoryStoriesStoryIdGet(
        storyId: string,
    ): CancelablePromise<StoryDetailResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/stories/{story_id}',
            path: {
                'story_id': storyId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Story
     * Update a story.
     * @param storyId
     * @param requestBody
     * @returns StoryResponse Successful Response
     * @throws ApiError
     */
    public static updateStoryStoriesStoryIdPut(
        storyId: string,
        requestBody: StoryCreate,
    ): CancelablePromise<StoryResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/stories/{story_id}',
            path: {
                'story_id': storyId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Story
     * Delete a story.
     * @param storyId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deleteStoryStoriesStoryIdDelete(
        storyId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/stories/{story_id}',
            path: {
                'story_id': storyId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Add Story Item
     * Add a generation to a story.
     * @param storyId
     * @param requestBody
     * @returns StoryItemDetail Successful Response
     * @throws ApiError
     */
    public static addStoryItemStoriesStoryIdItemsPost(
        storyId: string,
        requestBody: StoryItemCreate,
    ): CancelablePromise<StoryItemDetail> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/stories/{story_id}/items',
            path: {
                'story_id': storyId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Remove Story Item
     * Remove a story item from a story.
     * @param storyId
     * @param itemId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static removeStoryItemStoriesStoryIdItemsItemIdDelete(
        storyId: string,
        itemId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/stories/{story_id}/items/{item_id}',
            path: {
                'story_id': storyId,
                'item_id': itemId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Story Item Times
     * Update story item timecodes.
     * @param storyId
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static updateStoryItemTimesStoriesStoryIdItemsTimesPut(
        storyId: string,
        requestBody: StoryItemBatchUpdate,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/stories/{story_id}/items/times',
            path: {
                'story_id': storyId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Reorder Story Items
     * Reorder story items and recalculate timecodes.
     * @param storyId
     * @param requestBody
     * @returns StoryItemDetail Successful Response
     * @throws ApiError
     */
    public static reorderStoryItemsStoriesStoryIdItemsReorderPut(
        storyId: string,
        requestBody: StoryItemReorder,
    ): CancelablePromise<Array<StoryItemDetail>> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/stories/{story_id}/items/reorder',
            path: {
                'story_id': storyId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Move Story Item
     * Move a story item (update position and/or track).
     * @param storyId
     * @param itemId
     * @param requestBody
     * @returns StoryItemDetail Successful Response
     * @throws ApiError
     */
    public static moveStoryItemStoriesStoryIdItemsItemIdMovePut(
        storyId: string,
        itemId: string,
        requestBody: StoryItemMove,
    ): CancelablePromise<StoryItemDetail> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/stories/{story_id}/items/{item_id}/move',
            path: {
                'story_id': storyId,
                'item_id': itemId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Trim Story Item
     * Trim a story item.
     * @param storyId
     * @param itemId
     * @param requestBody
     * @returns StoryItemDetail Successful Response
     * @throws ApiError
     */
    public static trimStoryItemStoriesStoryIdItemsItemIdTrimPut(
        storyId: string,
        itemId: string,
        requestBody: StoryItemTrim,
    ): CancelablePromise<StoryItemDetail> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/stories/{story_id}/items/{item_id}/trim',
            path: {
                'story_id': storyId,
                'item_id': itemId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Split Story Item
     * Split a story item at a given time, creating two clips.
     * @param storyId
     * @param itemId
     * @param requestBody
     * @returns StoryItemDetail Successful Response
     * @throws ApiError
     */
    public static splitStoryItemStoriesStoryIdItemsItemIdSplitPost(
        storyId: string,
        itemId: string,
        requestBody: StoryItemSplit,
    ): CancelablePromise<Array<StoryItemDetail>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/stories/{story_id}/items/{item_id}/split',
            path: {
                'story_id': storyId,
                'item_id': itemId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Duplicate Story Item
     * Duplicate a story item.
     * @param storyId
     * @param itemId
     * @returns StoryItemDetail Successful Response
     * @throws ApiError
     */
    public static duplicateStoryItemStoriesStoryIdItemsItemIdDuplicatePost(
        storyId: string,
        itemId: string,
    ): CancelablePromise<StoryItemDetail> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/stories/{story_id}/items/{item_id}/duplicate',
            path: {
                'story_id': storyId,
                'item_id': itemId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Set Story Item Version
     * Pin a story item to a specific generation version.
     * @param storyId
     * @param itemId
     * @param requestBody
     * @returns StoryItemDetail Successful Response
     * @throws ApiError
     */
    public static setStoryItemVersionStoriesStoryIdItemsItemIdVersionPut(
        storyId: string,
        itemId: string,
        requestBody: StoryItemVersionUpdate,
    ): CancelablePromise<StoryItemDetail> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/stories/{story_id}/items/{item_id}/version',
            path: {
                'story_id': storyId,
                'item_id': itemId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Export Story Audio
     * Export story as single mixed audio file.
     * @param storyId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static exportStoryAudioStoriesStoryIdExportAudioGet(
        storyId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/stories/{story_id}/export-audio',
            path: {
                'story_id': storyId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Preview Effects
     * Apply effects to a generation's clean audio and stream back without saving.
     * @param generationId
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static previewEffectsEffectsPreviewGenerationIdPost(
        generationId: string,
        requestBody: ApplyEffectsRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/effects/preview/{generation_id}',
            path: {
                'generation_id': generationId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Available Effects
     * List all available effect types with parameter definitions.
     * @returns AvailableEffectsResponse Successful Response
     * @throws ApiError
     */
    public static getAvailableEffectsEffectsAvailableGet(): CancelablePromise<AvailableEffectsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/effects/available',
        });
    }
    /**
     * List Effect Presets
     * List all effect presets (built-in + user-created).
     * @returns EffectPresetResponse Successful Response
     * @throws ApiError
     */
    public static listEffectPresetsEffectsPresetsGet(): CancelablePromise<Array<EffectPresetResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/effects/presets',
        });
    }
    /**
     * Create Effect Preset
     * Create a new effect preset.
     * @param requestBody
     * @returns EffectPresetResponse Successful Response
     * @throws ApiError
     */
    public static createEffectPresetEffectsPresetsPost(
        requestBody: EffectPresetCreate,
    ): CancelablePromise<EffectPresetResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/effects/presets',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Effect Preset
     * Get a specific effect preset.
     * @param presetId
     * @returns EffectPresetResponse Successful Response
     * @throws ApiError
     */
    public static getEffectPresetEffectsPresetsPresetIdGet(
        presetId: string,
    ): CancelablePromise<EffectPresetResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/effects/presets/{preset_id}',
            path: {
                'preset_id': presetId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Effect Preset
     * Update an effect preset.
     * @param presetId
     * @param requestBody
     * @returns EffectPresetResponse Successful Response
     * @throws ApiError
     */
    public static updateEffectPresetEffectsPresetsPresetIdPut(
        presetId: string,
        requestBody: EffectPresetUpdate,
    ): CancelablePromise<EffectPresetResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/effects/presets/{preset_id}',
            path: {
                'preset_id': presetId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Effect Preset
     * Delete a user effect preset.
     * @param presetId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deleteEffectPresetEffectsPresetsPresetIdDelete(
        presetId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/effects/presets/{preset_id}',
            path: {
                'preset_id': presetId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Generation Versions
     * List all versions for a generation.
     * @param generationId
     * @returns GenerationVersionResponse Successful Response
     * @throws ApiError
     */
    public static listGenerationVersionsGenerationsGenerationIdVersionsGet(
        generationId: string,
    ): CancelablePromise<Array<GenerationVersionResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/generations/{generation_id}/versions',
            path: {
                'generation_id': generationId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Apply Effects To Generation
     * Apply an effects chain to an existing generation, creating a new version.
     * @param generationId
     * @param requestBody
     * @returns GenerationVersionResponse Successful Response
     * @throws ApiError
     */
    public static applyEffectsToGenerationGenerationsGenerationIdVersionsApplyEffectsPost(
        generationId: string,
        requestBody: ApplyEffectsRequest,
    ): CancelablePromise<GenerationVersionResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/generations/{generation_id}/versions/apply-effects',
            path: {
                'generation_id': generationId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Set Default Version
     * Set a specific version as the default for a generation.
     * @param generationId
     * @param versionId
     * @returns GenerationVersionResponse Successful Response
     * @throws ApiError
     */
    public static setDefaultVersionGenerationsGenerationIdVersionsVersionIdSetDefaultPut(
        generationId: string,
        versionId: string,
    ): CancelablePromise<GenerationVersionResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/generations/{generation_id}/versions/{version_id}/set-default',
            path: {
                'generation_id': generationId,
                'version_id': versionId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Generation Version
     * Delete a version. Cannot delete the last remaining version.
     * @param generationId
     * @param versionId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deleteGenerationVersionGenerationsGenerationIdVersionsVersionIdDelete(
        generationId: string,
        versionId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/generations/{generation_id}/versions/{version_id}',
            path: {
                'generation_id': generationId,
                'version_id': versionId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Version Audio
     * Serve audio for a specific version.
     * @param versionId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getVersionAudioAudioVersionVersionIdGet(
        versionId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/audio/version/{version_id}',
            path: {
                'version_id': versionId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Audio
     * Serve generated audio file (serves the default version).
     * @param generationId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getAudioAudioGenerationIdGet(
        generationId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/audio/{generation_id}',
            path: {
                'generation_id': generationId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Sample Audio
     * Serve profile sample audio file.
     * @param sampleId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getSampleAudioSamplesSampleIdGet(
        sampleId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/samples/{sample_id}',
            path: {
                'sample_id': sampleId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Load Model
     * Manually load TTS model.
     * @param modelSize
     * @returns any Successful Response
     * @throws ApiError
     */
    public static loadModelModelsLoadPost(
        modelSize: string = '1.7B',
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/models/load',
            query: {
                'model_size': modelSize,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Unload Model
     * Unload the default Qwen TTS model to free memory.
     * @returns any Successful Response
     * @throws ApiError
     */
    public static unloadModelModelsUnloadPost(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/models/unload',
        });
    }
    /**
     * Unload Model By Name
     * Unload a specific model from memory without deleting it from disk.
     * @param modelName
     * @returns any Successful Response
     * @throws ApiError
     */
    public static unloadModelByNameModelsModelNameUnloadPost(
        modelName: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/models/{model_name}/unload',
            path: {
                'model_name': modelName,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Model Progress
     * Get model download progress via Server-Sent Events.
     * @param modelName
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getModelProgressModelsProgressModelNameGet(
        modelName: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/models/progress/{model_name}',
            path: {
                'model_name': modelName,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Models Cache Dir
     * Get the path to the HuggingFace model cache directory.
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getModelsCacheDirModelsCacheDirGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/models/cache-dir',
        });
    }
    /**
     * Migrate Models
     * Move all downloaded models to a new directory with byte-level progress via SSE.
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static migrateModelsModelsMigratePost(
        requestBody: ModelMigrateRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/models/migrate',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Migration Progress
     * Get model migration progress via Server-Sent Events.
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getMigrationProgressModelsMigrateProgressGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/models/migrate/progress',
        });
    }
    /**
     * Get Model Status
     * Get status of all available models.
     * @returns ModelStatusListResponse Successful Response
     * @throws ApiError
     */
    public static getModelStatusModelsStatusGet(): CancelablePromise<ModelStatusListResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/models/status',
        });
    }
    /**
     * Trigger Model Download
     * Trigger download of a specific model.
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static triggerModelDownloadModelsDownloadPost(
        requestBody: ModelDownloadRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/models/download',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Cancel Model Download
     * Cancel or dismiss an errored/stale download task.
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static cancelModelDownloadModelsDownloadCancelPost(
        requestBody: ModelDownloadRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/models/download/cancel',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Model
     * Delete a downloaded model from the HuggingFace cache.
     * @param modelName
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deleteModelModelsModelNameDelete(
        modelName: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/models/{model_name}',
            path: {
                'model_name': modelName,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Clear All Tasks
     * Clear all download tasks and progress state.
     * @returns any Successful Response
     * @throws ApiError
     */
    public static clearAllTasksTasksClearPost(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/tasks/clear',
        });
    }
    /**
     * Clear Cache
     * Clear all voice prompt caches (memory and disk).
     * @returns any Successful Response
     * @throws ApiError
     */
    public static clearCacheCacheClearPost(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/cache/clear',
        });
    }
    /**
     * Get Active Tasks
     * Return all currently active downloads and generations.
     * @returns ActiveTasksResponse Successful Response
     * @throws ApiError
     */
    public static getActiveTasksTasksActiveGet(): CancelablePromise<ActiveTasksResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/tasks/active',
        });
    }
    /**
     * Get Cuda Status
     * Get CUDA backend download/availability status.
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getCudaStatusBackendCudaStatusGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/backend/cuda-status',
        });
    }
    /**
     * Download Cuda Backend
     * Download the CUDA backend binary.
     * @returns any Successful Response
     * @throws ApiError
     */
    public static downloadCudaBackendBackendDownloadCudaPost(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/backend/download-cuda',
        });
    }
    /**
     * Delete Cuda Backend
     * Delete the downloaded CUDA backend binary.
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deleteCudaBackendBackendCudaDelete(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/backend/cuda',
        });
    }
    /**
     * Get Cuda Download Progress
     * Get CUDA backend download progress via Server-Sent Events.
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getCudaDownloadProgressBackendCudaProgressGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/backend/cuda-progress',
        });
    }
}
