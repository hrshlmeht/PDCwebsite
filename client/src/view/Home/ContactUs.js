import React, { useEffect, useState } from "react";
import {
  Segment,
  Form,
  Grid,
  Input,
  Button,
  Icon,
  Dropdown,
  Select,
} from "semantic-ui-react";
import { config } from "../../common/config/config";
import Axios from "axios";
import "./Home.css";
import moment from "moment";
import { Spinner } from "react-activity";
const img = require("../../assets/logo.png");

function ContactUs() {
  const path = config();
  const options = [
    { key: "1", text: "Website", value: "website" },
    { key: "2", text: "CDC", value: "cdc" },
    { key: "3", text: "Projects", value: "projects" },
    { key: "4", text: "Other", value: "other" },
  ];
  const [selectedOption, setSelectedOption] = useState("");
  const [loading, setLoading] = useState(false);
  // const [other, setOther] = useState(false);
  const [queryEx, setQueryEx] = useState([]);

  useEffect(() => {
    Axios.get(path + "home/queryexecutives", {})
      .then((res) => {
        return res.data;
      })
      .then((data) => {
        setQueryEx(data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [setQueryEx, path]);

  function handleOptionChange(e, val) {
    setSelectedOption(val);
    // if (val === "other") {
    //   setOther(true);
    // } else {
    //   setOther(false);
    // }
  }

  const queryEmailer = (fname, lname, category, email, message) => {
    var queryExec = queryEx.find(exec => exec.category === category)
    var toEmail = queryExec.email;
    var toName = queryExec.name;
    
    const emailOptions = {
      email_to_address: toEmail,
      email_to_name: toName,
      query_category: category,
      first_name: fname,
      last_name: lname,
      query_message: message,
      query_email: email,
      date: moment().format("YYYY-MM-DD"),
    };
    //send email
    Axios.post(path + "email/query", emailOptions).catch((e) => {
      console.log(e);
    });
  };

  function handleSubmit() {
    setLoading(true);
    const fname = document.getElementById("fname").value;
    const lname = document.getElementById("lname").value;
    const category = selectedOption;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    if (category) {
      Axios.post(path + "home/contact", {
        fname,
        lname,
        category,
        email,
        message,
      })
        .then((res) => {
          setLoading(false);
          document.getElementById("fname").value = null;
          document.getElementById("lname").value = null;
          document.getElementById("category").innerHTML = null;
          document.getElementById("email").value = null;
          document.getElementById("message").value = null;
          queryEmailer(fname, lname, category, email, message);
          alert("Your query has been sent successfully!");
        })
        .catch((e) => {
          setLoading(false);
          alert("Something went wrong! Please try again after some time.");
          console.log(e);
        });
    } else {
      alert("Please Enter all Details!");
      setLoading(false);
    }
  }

  return (
    <div className="frag1">
      <h1 className="header">CONTACT US</h1>
      <div>
        <Grid className="grid-col-1" columns={2}>
          <Grid.Column>
            <div className="row">
              <img className="col-md-4 logo" src={img} />
              <h3 className="cont-hd col-md-6">
                Professional Development Club, uOttawa
              </h3>
              {/* <button onClick={() => queryEmailer('F', 'L', 'Website', 'E', 'M')} /> */}
            </div>
          </Grid.Column>
          <Grid.Column>
            <Form>
              <Form.Group widths="equal">
                <Form.Field
                  control={Input}
                  placeholder="Enter First Name"
                  id="fname"
                  required={true}
                />
                <Form.Field
                  control={Input}
                  placeholder="Enter Last Name"
                  id="lname"
                  required={true}
                />
              </Form.Group>
              <Form.Select
                placeholder="Select Category for Query"
                id="category"
                options={options}
                onChange={(e, { value }) =>
                  handleOptionChange(e, value?.toString())
                }
                required={true}
              />
              {/* {other ? (
                <Form.Field
                  id="other"
                  control={Input}
                  placeholder="Enter Subject"
                  required={true}
                />
              ) : null} */}
              <Form.Field
                id="email"
                control={Input}
                placeholder="Enter Email"
                required={true}
              />
              <Form.TextArea
                id="message"
                control={Input}
                placeholder="Enter Message"
                required={true}
              />
              {loading ? (
                <Form.Button
                  className="bt-sq"
                  size="large"
                  color="linkedin"
                  disabled
                >
                  <Spinner color="white" size={15} speed={1} animating={true} />
                </Form.Button>
              ) : (
                <Form.Button
                  className="bt-sq"
                  size="large"
                  color="#ccc"
                  onClick={handleSubmit}
                >
                  Send Message
                </Form.Button>
              )}
            </Form>
          </Grid.Column>
        </Grid>
      </div>
    </div>
  );
}

export default ContactUs;