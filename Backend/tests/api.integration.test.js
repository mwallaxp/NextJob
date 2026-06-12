import { after, before, beforeEach, describe, it } from "node:test";
import assert from "node:assert/strict";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";

process.env.NODE_ENV = "test";
process.env.SECRET_KEY = "test-secret";
process.env.CLIENT_URL = "http://localhost:5173";

const [{ default: app }, { default: User }, { default: Company }, { default: Job }, { default: Application }] = await Promise.all([
  import("../index.js"),
  import("../modules/user.module.js"),
  import("../modules/company.model.js"),
  import("../modules/job.model.js"),
  import("../modules/application.model.js"),
]);

let mongoServer;
let recruiter;
let otherRecruiter;
let candidate;
let company;
let job;
let application;

const tokenFor = (user) =>
  jwt.sign({ userId: user._id, role: user.role }, process.env.SECRET_KEY, { expiresIn: "1h" });

before(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

after(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Promise.all([
    User.deleteMany({}),
    Company.deleteMany({}),
    Job.deleteMany({}),
    Application.deleteMany({}),
  ]);

  recruiter = await User.create({
    fullname: "Recruiter One",
    email: "recruiter@example.com",
    phonenumber: "111",
    password: "password",
    role: "recruiter",
  });
  otherRecruiter = await User.create({
    fullname: "Recruiter Two",
    email: "other@example.com",
    phonenumber: "222",
    password: "password",
    role: "recruiter",
  });
  candidate = await User.create({
    fullname: "Candidate One",
    email: "candidate@example.com",
    phonenumber: "333",
    password: "password",
    role: "candidate",
    profile: { skills: ["React", "Node.js"] },
  });
  company = await Company.create({ name: "Acme", userid: recruiter._id });
  job = await Job.create({
    title: "Frontend Engineer",
    description: "Build candidate-facing web applications",
    requirements: ["React"],
    salary: "80000-100000",
    salaryMin: 80000,
    salaryMax: 100000,
    experience: "Mid Level",
    currency: "USD",
    location: "Remote",
    jobType: "Full-Time",
    skills: ["React", "Node.js"],
    position: 1,
    company: company._id,
    created_by: recruiter._id,
  });
  application = await Application.create({ job: job._id, applicant: candidate._id });
  job.applications.push(application._id);
  await job.save();
});

describe("/api/v1 route integration", () => {
  it("allows a recruiter to create, edit, pause, and close owned jobs", async () => {
    const recruiterToken = tokenFor(recruiter);

    const createResponse = await request(app)
      .post("/api/v1/job/post")
      .set("Authorization", `Bearer ${recruiterToken}`)
      .send({
        title: "Backend Engineer",
        description: "Own APIs for the hiring platform",
        requirements: ["Node.js", "MongoDB"],
        salary: "90000-120000",
        location: "Remote",
        jobType: "Full-Time",
        experienceLevel: "Senior",
        position: 2,
        companyId: company._id,
        currency: "USD",
        skills: ["Node.js", "MongoDB"],
      })
      .expect(201);

    const createdJobId = createResponse.body.job._id;
    assert.equal(createResponse.body.success, true);

    const editResponse = await request(app)
      .patch(`/api/v1/job/${createdJobId}`)
      .set("Authorization", `Bearer ${recruiterToken}`)
      .send({ title: "Senior Backend Engineer", salary: "95000-125000" })
      .expect(200);

    assert.equal(editResponse.body.job.title, "Senior Backend Engineer");

    const pauseResponse = await request(app)
      .patch(`/api/v1/job/${createdJobId}/status`)
      .set("Authorization", `Bearer ${recruiterToken}`)
      .send({ status: "paused" })
      .expect(200);

    assert.equal(pauseResponse.body.job.status, "paused");

    const closeResponse = await request(app)
      .patch(`/api/v1/job/${createdJobId}/status`)
      .set("Authorization", `Bearer ${recruiterToken}`)
      .send({ status: "closed" })
      .expect(200);

    assert.equal(closeResponse.body.job.status, "closed");
  });

  it("blocks recruiters from changing jobs and applicants they do not own", async () => {
    const otherToken = tokenFor(otherRecruiter);

    await request(app)
      .patch(`/api/v1/job/${job._id}/status`)
      .set("Authorization", `Bearer ${otherToken}`)
      .send({ status: "closed" })
      .expect(404);

    await request(app)
      .patch(`/api/v1/application/${application._id}/review`)
      .set("Authorization", `Bearer ${otherToken}`)
      .send({ interviewStage: "interview", recruiterComment: "Looks good" })
      .expect(403);
  });

  it("supports applicant search, pagination, notes, stages, and status updates", async () => {
    const recruiterToken = tokenFor(recruiter);

    const listResponse = await request(app)
      .get(`/api/v1/application/${job._id}/applicant`)
      .query({ search: "Candidate", page: 1, limit: 5 })
      .set("Authorization", `Bearer ${recruiterToken}`)
      .expect(200);

    assert.equal(listResponse.body.total, 1);
    assert.equal(listResponse.body.job.applications[0].matchScore, 100);

    const reviewResponse = await request(app)
      .patch(`/api/v1/application/${application._id}/review`)
      .set("Authorization", `Bearer ${recruiterToken}`)
      .send({
        interviewStage: "interview",
        recruiterComment: "Strong React profile",
        note: "Schedule technical interview",
      })
      .expect(200);

    assert.equal(reviewResponse.body.application.interviewStage, "interview");
    assert.equal(reviewResponse.body.application.notes.length, 1);

    const statusResponse = await request(app)
      .post(`/api/v1/application/status/${application._id}/update`)
      .set("Authorization", `Bearer ${recruiterToken}`)
      .send({ status: "accepted" })
      .expect(200);

    assert.equal(statusResponse.body.success, true);
  });

  it("covers core /api/v1 route groups with authenticated smoke checks", async () => {
    const recruiterToken = tokenFor(recruiter);
    const candidateToken = tokenFor(candidate);

    await request(app).get("/api/v1/job/get").expect(200);
    await request(app).get(`/api/v1/job/get/${job._id}`).expect(200);
    await request(app).get("/api/v1/company/get").set("Authorization", `Bearer ${recruiterToken}`).expect(200);
    await request(app).get("/api/v1/application/get").set("Authorization", `Bearer ${candidateToken}`).expect(200);
    await request(app).get("/api/v1/admin/stats").set("Authorization", `Bearer ${candidateToken}`).expect(403);
  });
});
