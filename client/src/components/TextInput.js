import React, { Component } from "react"

export class TextInput extends Component {
  render() {
    const { placeholder, value, onChange } = this.props
    return (
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    )
  }
}
