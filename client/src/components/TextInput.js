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
        style={{
          padding: "0.6em 1.4em",
          border: "2px solid #d5a67a",
          borderRadius: "0.6em",
          marginLeft: 8
        }}
      />
    )
  }
}
