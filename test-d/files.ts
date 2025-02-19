import {h, s} from 'hastscript'
import type {Root} from 'hast'
import {expectType} from 'tsd'

expectType<Root>(h())
expectType<Root>(s())
