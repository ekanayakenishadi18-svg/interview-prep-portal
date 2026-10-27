require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Quiz = require('../models/Quiz');

const quizData = {
  title: 'Operating Systems Basics',
  description:
    'Test your understanding of processes, threads, memory, and operating system fundamentals.',
  category: 'Operating Systems',
  difficulty: 'Easy',
  timeLimit: 5,
  isPublished: true,
  questions: [
    {
      question: 'What is a process in an operating system?',
      options: [
        'A program that is currently executing',
        'A file stored on a hard drive',
        'A device used to connect to a network',
        'A programming language',
      ],
      correctIndex: 0,
      explanation:
        'A process is a program in execution. It has its own process state and allocated resources, including a virtual address space.',
    },
    {
      question: 'What is a thread in an operating system?',
      options: [
        'A unit of execution within a process',
        'A storage device',
        'A network protocol',
        'A type of database',
      ],
      correctIndex: 0,
      explanation:
        'A thread is a unit of execution within a process. Threads in the same process can share memory and other resources.',
    },
    {
      question: 'Which resource is generally shared by threads of the same process?',
      options: [
        'Heap memory and open files',
        'Stack and registers',
        'Program counter',
        'CPU core only',
      ],
      correctIndex: 0,
      explanation:
        'Threads generally share heap memory and open files. Each thread has its own stack, registers, and program counter.',
    },
    {
      question: 'Which of these is an operating system?',
      options: ['Linux', 'HTML', 'MongoDB', 'React'],
      correctIndex: 0,
      explanation:
        'Linux is an operating system that manages computer hardware and software resources.',
    },
    {
      question: 'What is the main purpose of virtual memory?',
      options: [
        'To provide processes with a virtual address space that can exceed available physical RAM',
        'To permanently store files instead of using a disk',
        'To increase the CPU clock speed',
        'To replace the operating system',
      ],
      correctIndex: 0,
      explanation:
        'Virtual memory gives a process its own virtual address space and allows the operating system to use storage to support memory beyond available physical RAM.',
    },
  ],
};

async function main() {
  try {
    await connectDB();

    const existing = await Quiz.findOne({ title: quizData.title });

    if (existing) {
      console.log(
        'A quiz with this title already exists. No changes were made.'
      );
      return;
    }

    await Quiz.create(quizData);
    console.log('Quiz created successfully with all 5 questions.');
  } catch (error) {
    console.error('Quiz creation failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

main();
