import { Config } from '@remotion/cli/config';
import { enableTailwind } from '@remotion/tailwind';

Config.overrideBundlerConfig((currentConfiguration) => {
  return enableTailwind(currentConfiguration);
});

Config.setVideoImageFormat('jpeg');
Config.setStillImageFormat('png');
Config.setOverwriteOutput(true);
