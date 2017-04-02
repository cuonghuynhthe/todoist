import * as React from 'react'
import * as c from 'classnames'

interface IButtonProps extends React.Props<any> {
  label: string
  icon?: string
  hoverable?: boolean
  active?: boolean
  onClick?: React.EventHandler<React.MouseEvent>
  cid?: string
}