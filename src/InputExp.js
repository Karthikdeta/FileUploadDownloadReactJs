import fileDownload from "js-file-download";
import { useRef, useState } from "react";
import './inputExp.css';

export default function () {
    const fileNameInputEl = useRef();
    const [fileList, setFileList] = useState({
        filesAvailble: false,
        filesInfo: []
    });

    function handleChange(event) {
        console.log(event.target.value);
    }

    function downloadFileFromDB(id, fileName) {
        fetch(`http://localhost:8080/api/downloadFileFromDB?id=${id}`, {
            method: 'GET'
        })
            .then(res => res.blob())
            .then(blob => fileDownload(blob, fileName))
            .catch(err => console.log(err));
    }
    
    function downloadFile() {
        let fileName = fileNameInputEl.current.value;
        fetch(`http://localhost:8080/api/downloadFile?fileName=${fileName}`, {
            method: 'GET'
        })
            .then(res => res.blob())
            .then(blob => {
                // Create blob link to download
                const url = window.URL.createObjectURL(
                    new Blob([blob]),
                );
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute(
                    'download',
                    fileName,
                );
                // Append to html link element page
                document.body.appendChild(link);

                // Start download
                link.click();

                // Clean up and remove the link
                link.parentNode.removeChild(link);
            })
            .catch(err => console.log(err));
    }

    function handleFileInputChange(event) {
        console.log(event);
        console.log(event.target.files);
        console.log(event.target.files[0].name);
        const formData = new FormData();
        for (const file of event.target.files) {
            formData.append('files', file, file.name);
        }
        //formData.append('file', event.target.files[0], event.target.files[0].name);
        const myHeaders = new Headers();
        //myHeaders.append('Content-Type', 'multipart/form-data');
        //myHeaders.append('Access-Control-Allow-Origin', '*');
        fetch('http://localhost:8080/api/uploadFilesToDB', {
            method: 'POST',
            body: formData
            // mode: 'no-cors',
            //headers: myHeaders
        })
            .then(res => console.log(res))
            .catch(err => console.log(err));
    }

    function handleDateTimeLocalChange(event) {
        console.log(event.target.value);
    }

    function getAllFiles() {
        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        fetch('http://localhost:8080/api/getAllFiles', {
            method: 'GET',
            headers: myHeaders
        }).then(res => res.json()).then(data => {
            console.log(data);
            setFileList({
                filesAvailble: true,
                filesInfo: data
            });
        }).catch(err => console.log(err));
    }

    return (
        <div className="inputExpContainer">
            <label>Name</label><br />
            <input type="text" name="name" onChange={handleChange} /> <br /> <br />
            <input type="file" name="file" multiple onChange={handleFileInputChange} /><br /> <br />
            <label>Meeting Time</label><br />
            <input type="datetime-local" name="meeting-time" onChange={handleDateTimeLocalChange} /> <br /> <br />
            <label>File Name</label><br />
            <input name="fileName" ref={fileNameInputEl} /> <br /> <br />
            <button type="submit" onClick={downloadFile}>Download File</button><span>&nbsp;&nbsp;</span>
            <button type="submit" onClick={getAllFiles}>Get All Files</button>
            <br /><br />

            <table className="table">
                <thead className="thead-light">
                    <tr>
                        <th scope="col">File Id</th>
                        <th scope="col">File Name</th>
                        <th scope="col">File Created By</th>
                        <th scope="col">File Created Ts</th>
                        <th scope="col">File Download Link</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        fileList.filesInfo.map(file =>
                            <tr key={file.id}>
                                <th scope="row">{file.id}</th>
                                <td>{file.fileName}</td>
                                <td>{file.fileCreatedBy}</td>
                                <td>{file.fileCreatedTs}</td>
                                <td><button className="button" onClick={e => downloadFileFromDB(file.id, file.fileName)}>
                                    Download File</button></td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
        </div>
    )
}