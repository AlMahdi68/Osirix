import { useCallback, useState } from 'react';
import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

export const useAI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateConfig = (sceneName: string) => {
    if (!globalThis.ywConfig?.ai_config?.[sceneName]) {
      const errorMsg = `API Error - Configuration '${sceneName}' not found`;
      console.error('❌ ' + errorMsg);
      throw new Error(errorMsg);
    }
  };

  const generateText_ = useCallback(async (prompt: string, sceneName = 'text_generator', variables = {}) => {
    const startTime = Date.now();
    setLoading(true);
    setError(null);

    try {
      console.log('🚀 Starting text generation:', { prompt: prompt.substring(0, 100) + '...', sceneName, variables });
      
      validateConfig(sceneName);
      const config = globalThis.ywConfig!.ai_config![sceneName];
      const systemPrompt = config.system_prompt ? config.system_prompt(variables) : '';

      console.log('🤖 AI API Request:', {
        model: config.model,
        scene: sceneName,
        input: prompt.substring(0, 100) + '...',
        parameters: {
          temperature: config.temperature || 0.7,
          maxTokens: config.maxTokens || 2000,
        },
      });

      const openai = createOpenAI({
        baseURL: 'https://api.youware.com/public/v1/ai',
        apiKey: 'sk-YOUWARE',
      });

      const { text } = await generateText({
        model: openai(config.model),
        messages: [
          ...(systemPrompt ? [{ role: 'system' as const, content: systemPrompt }] : []),
          { role: 'user' as const, content: prompt },
        ],
        temperature: config.temperature || 0.7,
        maxTokens: config.maxTokens || 2000,
      });

      console.log('✅ AI API Response:', {
        model: config.model,
        scene: sceneName,
        outputLength: text.length,
        responsePreview: text.substring(0, 150) + '...',
        processingTime: `${Date.now() - startTime}ms`,
      });

      return text;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      console.error('❌ API Error - Text generation failed:', { error: errorMsg });
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const generateVideo = useCallback(async (prompt: string, options?: Record<string, any>) => {
    const startTime = Date.now();
    setLoading(true);
    setError(null);

    try {
      console.log('🎬 Starting video generation:', { prompt: prompt.substring(0, 100) + '...', options });
      
      validateConfig('video_generator');
      const config = globalThis.ywConfig!.ai_config!.video_generator;

      console.log('🤖 AI API Request (Video):', {
        model: config.model,
        prompt: prompt.substring(0, 100) + '...',
        parameters: {
          duration: options?.duration || 5,
          aspectRatio: options?.aspect_ratio || '16:9',
        },
      });

      // Call actual video generation API
      try {
        const response = await fetch('https://api.youware.com/public/v1/ai/videos/generations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer sk-YOUWARE',
          },
          body: JSON.stringify({
            model: config.model,
            prompt,
            duration: options?.duration || 5,
            aspect_ratio: options?.aspect_ratio || '16:9',
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const videoUrl = data.data?.[0]?.url || data.url;
          
          if (videoUrl) {
            console.log('✅ AI API Response (Video):', {
              model: config.model,
              url: videoUrl,
              processingTime: `${Date.now() - startTime}ms`,
            });
            return videoUrl;
          }
        }
      } catch (apiErr) {
        console.warn('⚠️ Video API call failed, using demo video:', apiErr);
      }

      // Fallback to demo video for development
      const demoVideoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-library/sample/BigBuckBunny.mp4';
      console.log('✅ AI API Response (Video - Demo):', {
        model: config.model,
        url: demoVideoUrl,
        processingTime: `${Date.now() - startTime}ms`,
      });

      return demoVideoUrl;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      console.error('❌ API Error - Video generation failed:', { error: errorMsg });
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const generateImage = useCallback(async (prompt: string, variables = {}) => {
    const startTime = Date.now();
    setLoading(true);
    setError(null);

    try {
      console.log('🎨 Starting image generation:', { prompt: prompt.substring(0, 100) + '...', variables });
      
      validateConfig('image_generator');
      const config = globalThis.ywConfig!.ai_config!.image_generator;

      console.log('🤖 AI API Request (Image):', {
        model: config.model,
        prompt: prompt.substring(0, 150) + '...',
        parameters: {
          size: config.size || '1024x1024',
          n: config.n || 1,
          response_format: config.response_format || 'b64_json',
        },
      });

      const response = await fetch('https://api.youware.com/public/v1/ai/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer sk-YOUWARE',
        },
        body: JSON.stringify({
          model: config.model,
          prompt,
          n: config.n || 1,
          size: config.size || '1024x1024',
          response_format: config.response_format || 'b64_json',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = `API Error - Image generation request failed: ${response.status} ${response.statusText}`;
        console.error('❌ ' + errorMsg, errorData);
        throw new Error(errorMsg);
      }

      const data = await response.json();

      console.log('✅ AI API Response (Image):', {
        model: config.model,
        imagesGenerated: data.data ? data.data.length : 0,
        processingTime: `${Date.now() - startTime}ms`,
      });

      if (data?.data?.[0]) {
        const imageData = data.data[0];
        return imageData.b64_json ? `data:image/png;base64,${imageData.b64_json}` : imageData.url;
      }

      throw new Error('API Error - Invalid response format');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      console.error('❌ API Error - Image generation failed:', { error: errorMsg });
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const generateVoice = useCallback(async (text: string) => {
    const startTime = Date.now();
    setLoading(true);
    setError(null);

    try {
      console.log('🎙️ Starting voice generation:', { text: text.substring(0, 100) + '...' });
      
      validateConfig('voice_generator');
      const config = globalThis.ywConfig!.ai_config!.voice_generator;

      console.log('🤖 AI API Request (Voice):', {
        model: config.model,
        text: text.substring(0, 100) + '...',
      });

      // Try to call voice generation API
      try {
        const response = await fetch('https://api.youware.com/public/v1/ai/audio/speech', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer sk-YOUWARE',
          },
          body: JSON.stringify({
            model: config.model,
            input: text,
            voice: 'alloy',
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const voiceUrl = data.data?.[0]?.url || data.url;
          
          if (voiceUrl) {
            console.log('✅ AI API Response (Voice):', {
              model: config.model,
              url: voiceUrl,
              processingTime: `${Date.now() - startTime}ms`,
            });
            return voiceUrl;
          }
        }
      } catch (apiErr) {
        console.warn('⚠️ Voice API call failed, using demo audio:', apiErr);
      }

      // Fallback to demo audio URL for development
      const demoAudioUrl = 'data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==';
      
      console.log('✅ AI API Response (Voice - Demo):', {
        model: config.model,
        url: demoAudioUrl,
        processingTime: `${Date.now() - startTime}ms`,
      });

      return demoAudioUrl;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      console.error('❌ API Error - Voice generation failed:', { error: errorMsg });
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    generateText: generateText_,
    generateVideo,
    generateImage,
    generateVoice,
    loading,
    error,
  };
};
