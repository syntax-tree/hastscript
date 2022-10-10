import {expectType} from 'tsd'
import type {Root} from 'hast'
import {h as hFromRoot} from '../html.js'
import {s as sFromRoot} from '../svg.js'
import {h as hFromIndex, s as sFromIndex} from '../index.js'

expectType<Root>(hFromRoot())
expectType<Root>(hFromIndex())
expectType<Root>(sFromRoot())
expectType<Root>(sFromIndex())
