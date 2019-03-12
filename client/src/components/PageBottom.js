import React, { Component } from "react"

export class PageBottom extends Component {
  render() {
    return (
      <div
        className="copyright py-4 text-center text-white"
        // style={{ position: "fixed", bottom: 0, width: "100%" }}
      >
        <div className="container">
          <small>Copyright &copy; Carrot in a Box 2019</small>
        </div>
      </div>
    )
  }
}
