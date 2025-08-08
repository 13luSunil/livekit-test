# AGENTS

This repository aims to build a LiveKit-based voice AI agent that can make outbound phone calls and converse with callees. The plan below outlines the components and tasks required.

## 1. Project scaffolding
- Run `npm init` to create the project.
- Install TypeScript, ts-node, ESLint, and Prettier.
- Configure `tsconfig.json`, `.eslintrc`, and `.prettierrc`.
- Create `src/` directory with a placeholder index file.

## 2. Environment & LiveKit configuration
- Define environment variables: `LIVEKIT_URL`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`.
- Add a `.env` template and load it using `dotenv`.
- Provide helper module `src/config/livekit.ts` exposing a configured `LiveKitServerClient`.

## 3. PSTN outbound call service
- Install LiveKit server SDK and any PSTN/voice packages.
- Implement `src/calling/outbound.ts` with `startOutboundCall(phoneNumber: string)`.
- Use LiveKit Call API (or Twilio bridge) to dial numbers.
- Emit call state events (ringing, answered, ended).

## 4. Speech-to-text pipeline
- Install and configure a speech recognition service (e.g., Whisper, cloud STT).
- In `src/voice/stt.ts`, stream inbound audio track to the STT service.
- Emit transcription events and handle partial vs. final transcripts.

## 5. Language model reasoning
- Integrate an LLM client library (e.g., OpenAI, LangChain).
- Build `src/ai/responder.ts` with `generateReply(text, context)`.
- Maintain conversation history per call.

## 6. Text-to-speech output
- Install TTS SDK (e.g., Google TTS, ElevenLabs).
- Create `src/voice/tts.ts` with `synthesize(text)` returning audio data.
- Publish synthesized audio as an outbound track in LiveKit.

## 7. Conversation manager
- Create `src/conversation/session.ts` to orchestrate STT → LLM → TTS loop.
- Handle turn-taking, interruptions, and conversation end conditions.

## 8. Call initiation API
- Set up an HTTP server or CLI.
- Implement endpoint `/call` that accepts a phone number and triggers the outbound call module.

## 9. Logging, monitoring, and error handling
- Integrate logging (pino/winston) and metrics (`prom-client` or similar).
- Add centralized error handling and retry logic.

## 10. Deployment & testing
- Write `Dockerfile` and `.dockerignore`.
- Add `docker-compose.yml` for local testing.
- Document deployment steps in `README.md`.
- Create integration tests covering outbound call flow using mocks.

