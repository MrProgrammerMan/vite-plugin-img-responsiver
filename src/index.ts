import { Plugin } from 'rollup';
import Config from './config';
import defaults from './defaults';

export default function imgResponsiver(userConfig: Partial<Config> = {}): Plugin {

  // Merge user configuration with default configuration
  const config: Config = { ...defaults, ...userConfig };
  console.log(console.log(config));

  // Plugin implementation logic will go here

  return {
    name: 'img-responsiver'
  };
}
