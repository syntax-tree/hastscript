import {expectType} from 'tsd'
import type {Root} from 'hast'
import {h as hFromIndex, s as sFromIndex} from '../index.js'

expectType<Root>(hFromIndex())
expectType<Root>(sFromIndex())
