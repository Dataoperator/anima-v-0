import { Buffer } from 'buffer';
import * as process from 'process';
import * as util from 'util';
import * as stream from 'stream-browserify';

if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
  window.global = window;
  window.process = process;
  window.util = util;
  window.stream = stream;
}

export { Buffer, process, util, stream };